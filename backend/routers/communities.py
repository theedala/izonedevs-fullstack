from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, Community, User, user_communities
from schemas import (
    Community as CommunitySchema, 
    CommunityCreate, 
    CommunityUpdate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin

router = APIRouter()


@router.get("/", response_model=PaginatedResponse)
async def get_communities(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of communities"""
    query = db.query(Community).filter(Community.is_active == True)
    
    if category:
        query = query.filter(Community.category == category)
    
    if search:
        query = query.filter(
            (Community.name.contains(search)) |
            (Community.description.contains(search))
        )
    
    total = query.count()
    communities = query.offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[CommunitySchema.from_orm(community).dict() for community in communities],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{community_id}", response_model=CommunitySchema)
async def get_community(community_id: int, db: Session = Depends(get_db)):
    """Get community by ID"""
    community = db.query(Community).filter(
        Community.id == community_id,
        Community.is_active == True
    ).first()
    
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    return community


@router.post("/", response_model=CommunitySchema)
async def create_community(
    community_data: CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new community (admin only)"""
    db_community = Community(**community_data.dict())
    db.add(db_community)
    db.commit()
    db.refresh(db_community)
    return db_community


@router.put("/{community_id}", response_model=CommunitySchema)
async def update_community(
    community_id: int,
    community_update: CommunityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update community (admin only)"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    for field, value in community_update.dict(exclude_unset=True).items():
        setattr(community, field, value)
    
    db.commit()
    db.refresh(community)
    return community


@router.put("/{community_id}/active", response_model=APIResponse)
async def toggle_community_active(
    community_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Toggle community active status (admin only)"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    community.is_active = is_active
    db.commit()
    
    status_text = "activated" if is_active else "deactivated"
    return APIResponse(
        success=True,
        message=f"Community {status_text} successfully",
        data={"community_id": community_id, "is_active": is_active}
    )


@router.delete("/{community_id}", response_model=APIResponse)
async def delete_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete community (admin only)"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    community.is_active = False
    db.commit()
    
    return APIResponse(
        success=True,
        message="Community deleted successfully"
    )


@router.post("/{community_id}/join", response_model=APIResponse)
async def join_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Join a community"""
    community = db.query(Community).filter(
        Community.id == community_id,
        Community.is_active == True
    ).first()
    
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    # Check if user is already a member
    existing_membership = db.query(user_communities).filter(
        user_communities.c.user_id == current_user.id,
        user_communities.c.community_id == community_id
    ).first()
    
    if existing_membership:
        raise HTTPException(status_code=400, detail="Already a member of this community")
    
    # Add user to community
    db.execute(
        user_communities.insert().values(
            user_id=current_user.id,
            community_id=community_id
        )
    )
    
    # Update member count
    community.member_count += 1
    db.commit()
    
    return APIResponse(
        success=True,
        message="Successfully joined the community"
    )


@router.post("/{community_id}/leave", response_model=APIResponse)
async def leave_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Leave a community"""
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    # Check if user is a member
    existing_membership = db.query(user_communities).filter(
        user_communities.c.user_id == current_user.id,
        user_communities.c.community_id == community_id
    ).first()
    
    if not existing_membership:
        raise HTTPException(status_code=400, detail="Not a member of this community")
    
    # Remove user from community
    db.execute(
        user_communities.delete().where(
            user_communities.c.user_id == current_user.id,
            user_communities.c.community_id == community_id
        )
    )
    
    # Update member count
    if community.member_count > 0:
        community.member_count -= 1
    db.commit()
    
    return APIResponse(
        success=True,
        message="Successfully left the community"
    )


@router.get("/categories", response_model=List[str])
async def get_community_categories(db: Session = Depends(get_db)):
    """Get list of available community categories"""
    categories = db.query(Community.category).distinct().all()
    return [category[0] for category in categories if category[0]]