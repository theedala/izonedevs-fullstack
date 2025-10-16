from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db, ContactMessage, User
from schemas import (
    ContactMessage as ContactMessageSchema, 
    ContactMessageCreate, 
    JoinApplicationCreate,
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin
from services.email_service import EmailService

router = APIRouter()


@router.post("/", response_model=APIResponse)
async def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Create a new contact message"""
    db_message = ContactMessage(**message_data.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send email notification to admin
    try:
        await EmailService.send_contact_notification({
            "name": message_data.name,
            "email": message_data.email,
            "phone": getattr(message_data, 'phone', None),
            "subject": message_data.subject,
            "message": message_data.message
        })
    except Exception as e:
        print(f"Failed to send email notification: {e}")
    
    return APIResponse(
        success=True,
        message="Thank you for your message! We'll get back to you soon.",
        data={"message_id": db_message.id}
    )


@router.get("/", response_model=PaginatedResponse)
async def get_contact_messages(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get paginated list of contact messages (admin only)"""
    query = db.query(ContactMessage)
    
    if status:
        query = query.filter(ContactMessage.status == status)
    
    if search:
        query = query.filter(
            (ContactMessage.name.contains(search)) |
            (ContactMessage.email.contains(search)) |
            (ContactMessage.subject.contains(search))
        )
    
    total = query.count()
    messages = query.order_by(ContactMessage.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[ContactMessageSchema.from_orm(message).dict() for message in messages],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{message_id}", response_model=ContactMessageSchema)
async def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get contact message by ID (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    # Mark as read if it's unread
    if message.status == "unread":
        message.status = "read"
        db.commit()
    
    return message


@router.put("/{message_id}/read", response_model=APIResponse)
async def mark_message_as_read(
    message_id: int,
    is_read: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Mark contact message as read/unread (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    message.is_read = is_read
    message.status = "read" if is_read else "unread"
    db.commit()
    
    status_text = "read" if is_read else "unread"
    return APIResponse(
        success=True,
        message=f"Message marked as {status_text}",
        data={"message_id": message_id, "is_read": is_read}
    )


@router.put("/{message_id}/status", response_model=APIResponse)
async def update_message_status(
    message_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update contact message status (admin only)"""
    if status not in ["unread", "read", "replied"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    message.status = status
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Message status updated to {status}"
    )


@router.delete("/{message_id}", response_model=APIResponse)
async def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete contact message (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    db.delete(message)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Contact message deleted successfully"
    )


@router.get("/stats", response_model=dict)
async def get_contact_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get contact message statistics (admin only)"""
    total_messages = db.query(ContactMessage).count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.status == "unread").count()
    read_messages = db.query(ContactMessage).filter(ContactMessage.status == "read").count()
    replied_messages = db.query(ContactMessage).filter(ContactMessage.status == "replied").count()
    
    return {
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "read_messages": read_messages,
        "replied_messages": replied_messages
    }


@router.post("/join-application", response_model=APIResponse)
async def create_join_application(
    application_data: JoinApplicationCreate,
    db: Session = Depends(get_db)
):
    """Create a community join application"""
    # Create as a contact message with special subject
    subject = f"Community Join Application - {application_data.community or 'General'}"
    message = f"""Community Join Application

Name: {application_data.name}
Email: {application_data.email}
Phone: {application_data.phone or 'Not provided'}
Preferred Community: {application_data.community or 'Not specified'}
Experience Level: {application_data.experience or 'Not specified'}

Interests and Goals:
{application_data.interests or 'No details provided'}"""
    
    message_data = ContactMessageCreate(
        name=application_data.name,
        email=application_data.email,
        phone=application_data.phone,
        subject=subject,
        message=message
    )
    
    db_message = ContactMessage(**message_data.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send email notification for join application
    try:
        await EmailService.send_join_application_notification({
            "name": application_data.name,
            "email": application_data.email,
            "phone": application_data.phone,
            "community": application_data.community,
            "experience": application_data.experience,
            "interests": application_data.interests
        })
    except Exception as e:
        print(f"Failed to send join application email: {e}")
    
    return APIResponse(
        success=True,
        message="Thank you for your application! We'll review it and get back to you within 48 hours.",
        data={"message_id": db_message.id}
    )