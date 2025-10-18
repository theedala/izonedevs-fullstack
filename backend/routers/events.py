from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db, Event, User, event_attendees
from schemas import (
    Event as EventSchema, 
    EventCreate, 
    EventUpdate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def get_events(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    featured: Optional[bool] = None,
    upcoming: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of events"""
    query = db.query(Event)
    
    if status:
        query = query.filter(Event.status == status)
        
    if featured is not None:
        query = query.filter(Event.featured == featured)
        
    if upcoming:
        query = query.filter(Event.start_date > datetime.utcnow())
    
    total = query.count()
    events = query.order_by(Event.start_date.asc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[EventSchema.from_orm(event).dict() for event in events],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


# Compatibility route to view registrations via events router - MUST be before /{event_id}
@router.get("/registrations")
async def get_event_registrations_compat(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    event_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get event registrations (admin only) - compatibility endpoint"""
    from database import EventRegistration
    from sqlalchemy import or_

    query = db.query(EventRegistration)

    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)

    if status:
        query = query.filter(EventRegistration.registration_status == status)

    if search:
        query = query.filter(
            or_(
                EventRegistration.name.ilike(f"%{search}%"),
                EventRegistration.email.ilike(f"%{search}%"),
                EventRegistration.organization.ilike(f"%{search}%")
            )
        )

    total = query.count()
    # Sort by creation date, newest first
    registrations = query.order_by(EventRegistration.created_at.desc()).offset((page - 1) * size).limit(size).all()

    return {
        "items": registrations,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size
    }


@router.get("/{event_id}", response_model=EventSchema)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get event by ID"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("", response_model=EventSchema)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new event (admin only)"""
    db_event = Event(**event_data.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.put("/{event_id}", response_model=EventSchema)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update event (admin only)"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for field, value in event_update.dict(exclude_unset=True).items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", response_model=APIResponse)
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete event (admin only)"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    from database import EventRegistration
    
    # Delete all registrations for this event first
    db.query(EventRegistration).filter(EventRegistration.event_id == event_id).delete()
    
    # Now delete the event
    db.delete(event)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Event deleted successfully"
    )


    return APIResponse(
        success=True,
        message="Event featured status updated successfully"
    )

# Compatibility route for frontend - redirects to event_registrations
@router.post("/{event_id}/register")
async def register_for_event_compat(
    event_id: int,
    registration_data: dict,
    db: Session = Depends(get_db)
):
    """Register for an event (compatibility endpoint)"""
    from schemas import EventRegistrationCreate
    from database import EventRegistration, Event
    
    # Check if event exists
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.status in ["cancelled", "completed"]:
        raise HTTPException(status_code=400, detail="Event is not available for registration")
    
    # Check if user already registered
    existing_registration = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.email == registration_data.get("email")
    ).first()
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="You are already registered for this event")
    
    # Check if event is full
    if event.max_attendees:
        current_registrations = db.query(EventRegistration).filter(
            EventRegistration.event_id == event_id,
            EventRegistration.registration_status == "confirmed"
        ).count()
        
        if current_registrations >= event.max_attendees:
            raise HTTPException(status_code=400, detail="Event is full")
    
    # Create registration
    new_registration = EventRegistration(
        event_id=event_id,
        name=registration_data.get("name"),
        email=registration_data.get("email"),
        phone=registration_data.get("phone"),
        organization=registration_data.get("organization"),
        experience_level=registration_data.get("experience_level"),
        interests=registration_data.get("interests"),
        dietary_restrictions=registration_data.get("dietary_restrictions"),
        special_requirements=registration_data.get("special_requirements"),
        registration_status="confirmed"
    )
    
    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)

    # Send confirmation email (simplified, without QR code attachment)
    try:
        from services.email_service import EmailService
        
        # Format event details
        start_date = event.start_date.strftime("%B %d, %Y at %I:%M %p")
        location = event.location or "To be announced"
        
        # Create email body
        email_body = f"""
        <h2>Registration Confirmed!</h2>
        <p>Hi {new_registration.name},</p>
        <p>Thank you for registering for <strong>{event.title}</strong>!</p>
        
        <h3>Event Details:</h3>
        <ul>
            <li><strong>Event:</strong> {event.title}</li>
            <li><strong>Date:</strong> {start_date}</li>
            <li><strong>Location:</strong> {location}</li>
        </ul>
        
        <p>We look forward to seeing you there!</p>
        <p>If you have any questions, please reply to this email or contact us at izonemakers@gmail.com</p>
        
        <p>Best regards,<br>The iZonehub Team</p>
        """
        
        html_body = EmailService.create_email_template(email_body, "Registration Confirmed")
        
        # Send email without attachment
        await EmailService.send_email(
            to_email=new_registration.email,
            subject=f"Registration Confirmed: {event.title}",
            body=html_body,
            from_name="iZonehub Makerspace",
            is_html=True
        )
        print(f"✅ Confirmation email sent to {new_registration.email}")
    except Exception as e:
        # Don't fail the registration if email fails
        print(f"❌ Failed to send confirmation email: {e}")

    return new_registration