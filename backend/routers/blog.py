from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import re

from database import get_db, BlogPost, User
from schemas import (
    BlogPost as BlogPostSchema, 
    BlogPostCreate, 
    BlogPostUpdate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin

router = APIRouter()


def create_slug(title: str) -> str:
    """Create a URL-friendly slug from title"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


@router.get("/", response_model=PaginatedResponse)
async def get_blog_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = "published",
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of blog posts"""
    query = db.query(BlogPost)
    
    if status and status.strip():  # Only filter if status is not empty/whitespace
        query = query.filter(BlogPost.status == status)
        
    if featured is not None:
        query = query.filter(BlogPost.featured == featured)
    
    if search:
        query = query.filter(
            (BlogPost.title.contains(search)) |
            (BlogPost.excerpt.contains(search))
        )
    
    total = query.count()
    posts = query.order_by(BlogPost.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[BlogPostSchema.from_orm(post).dict() for post in posts],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{post_id}", response_model=BlogPostSchema)
async def get_blog_post(post_id: int, db: Session = Depends(get_db)):
    """Get blog post by ID"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Increment view count
    post.views += 1
    db.commit()
    
    return post


@router.get("/slug/{slug}", response_model=BlogPostSchema)
async def get_blog_post_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get blog post by slug"""
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Increment view count
    post.views += 1
    db.commit()
    
    return post


@router.post("/", response_model=BlogPostSchema)
async def create_blog_post(
    post_data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new blog post (admin only)"""
    # Generate slug from title
    base_slug = create_slug(post_data.title)
    slug = base_slug
    counter = 1
    
    # Ensure unique slug
    while db.query(BlogPost).filter(BlogPost.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    db_post = BlogPost(
        **post_data.dict(),
        slug=slug,
        author_id=current_user.id
    )
    
    if post_data.status == "published":
        db_post.published_at = datetime.utcnow()
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.put("/{post_id}", response_model=BlogPostSchema)
async def update_blog_post(
    post_id: int,
    post_update: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update blog post (admin only)"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = post_update.dict(exclude_unset=True)
    
    # Update slug if title changed
    if "title" in update_data:
        base_slug = create_slug(update_data["title"])
        slug = base_slug
        counter = 1
        
        # Ensure unique slug (excluding current post)
        while db.query(BlogPost).filter(
            BlogPost.slug == slug,
            BlogPost.id != post_id
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        post.slug = slug
    
    # Set published_at if status changed to published
    if update_data.get("status") == "published" and post.status != "published":
        post.published_at = datetime.utcnow()
    
    for field, value in update_data.items():
        if field != "title":  # title is handled above for slug generation
            setattr(post, field, value)
    
    if "title" in update_data:
        post.title = update_data["title"]
    
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", response_model=APIResponse)
async def delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete blog post (admin only)"""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(post)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Blog post deleted successfully"
    )