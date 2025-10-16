from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from database import get_db, Project, User, Community
from schemas import (
    Project as ProjectSchema, 
    ProjectCreate, 
    ProjectUpdate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin

router = APIRouter()


@router.get("/", response_model=PaginatedResponse)
async def get_projects(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    community_id: Optional[int] = None,
    status: Optional[str] = None,
    difficulty: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of projects"""
    query = db.query(Project)
    
    if community_id:
        query = query.filter(Project.community_id == community_id)
    
    if status:
        query = query.filter(Project.status == status)
    
    if difficulty:
        query = query.filter(Project.difficulty == difficulty)
        
    if featured is not None:
        query = query.filter(Project.featured == featured)
    
    if search:
        query = query.filter(
            (Project.title.contains(search)) |
            (Project.description.contains(search))
        )
    
    total = query.count()
    projects = query.order_by(Project.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[ProjectSchema.from_orm(project).dict() for project in projects],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get project by ID"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectSchema)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new project"""
    project_dict = project_data.dict()
    
    # Handle technologies as JSON - always convert list to JSON string
    if 'technologies' in project_dict:
        project_dict['technologies'] = json.dumps(project_dict['technologies'] or [])
    
    db_project = Project(
        **project_dict,
        creator_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update project (owner or admin only)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user is owner or admin
    if project.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = project_update.dict(exclude_unset=True)
    
    # Handle technologies as JSON - always convert list to JSON string
    if 'technologies' in update_data:
        update_data['technologies'] = json.dumps(update_data['technologies'] or [])
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", response_model=APIResponse)
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete project (owner or admin only)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user is owner or admin
    if project.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(project)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Project deleted successfully"
    )


@router.put("/{project_id}/feature", response_model=APIResponse)
async def toggle_project_featured(
    project_id: int,
    featured: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Toggle project featured status (admin only)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.featured = featured
    db.commit()
    
    status_text = "featured" if featured else "unfeatured"
    return APIResponse(
        success=True,
        message=f"Project {status_text} successfully"
    )