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


@router.get("/", response_model=PaginatedResponse)
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


@router.get("/{event_id}", response_model=EventSchema)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get event by ID"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/", response_model=EventSchema)
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