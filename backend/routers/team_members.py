from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, TeamMember
from schemas import TeamMemberCreate, TeamMember as TeamMemberSchema, APIResponse, PaginatedResponse
from auth import require_admin, get_current_active_user

router = APIRouter()


@router.get("", response_model=PaginatedResponse[TeamMemberSchema])
async def get_team_members(
    page: int = 1,
    size: int = 50,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of team members"""
    query = db.query(TeamMember)
    
    if is_active is not None:
        query = query.filter(TeamMember.is_active == is_active)
    
    query = query.order_by(TeamMember.order_priority.desc(), TeamMember.created_at.asc())
    
    total = query.count()
    members = query.offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=members,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{member_id}", response_model=TeamMemberSchema)
async def get_team_member(member_id: int, db: Session = Depends(get_db)):
    """Get a specific team member by ID"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.post("", response_model=APIResponse)
async def create_team_member(
    member_data: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Create a new team member (admin only)"""
    member = TeamMember(**member_data.dict())
    db.add(member)
    db.commit()
    db.refresh(member)
    
    return APIResponse(
        success=True,
        message="Team member created successfully",
        data={"member_id": member.id}
    )


@router.put("/{member_id}", response_model=APIResponse)
async def update_team_member(
    member_id: int,
    member_data: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update a team member (admin only)"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    for field, value in member_data.dict().items():
        setattr(member, field, value)
    
    db.commit()
    return APIResponse(
        success=True,
        message="Team member updated successfully"
    )


@router.delete("/{member_id}", response_model=APIResponse)
async def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Delete a team member (admin only)"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    db.delete(member)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Team member deleted successfully"
    )


@router.patch("/{member_id}/toggle-active", response_model=APIResponse)
async def toggle_member_active(
    member_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Toggle team member active status (admin only)"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    member.is_active = not member.is_active
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Team member {'activated' if member.is_active else 'deactivated'} successfully"
    )


@router.patch("/{member_id}/order", response_model=APIResponse)
async def update_member_order(
    member_id: int,
    order_priority: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update team member order priority (admin only)"""
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    member.order_priority = order_priority
    db.commit()
    
    return APIResponse(
        success=True,
        message="Team member order updated successfully"
    )