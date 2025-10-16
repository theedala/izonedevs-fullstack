from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from PIL import Image

from database import get_db, GalleryItem, User
from schemas import (
    GalleryItem as GalleryItemSchema, 
    GalleryItemCreate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin
from config import settings

router = APIRouter()


@router.get("/", response_model=PaginatedResponse)
async def get_gallery_items(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of gallery items"""
    query = db.query(GalleryItem)
    
    if category:
        query = query.filter(GalleryItem.category == category)
        
    if featured is not None:
        query = query.filter(GalleryItem.featured == featured)
    
    total = query.count()
    items = query.order_by(GalleryItem.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[GalleryItemSchema.from_orm(item).dict() for item in items],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{item_id}", response_model=GalleryItemSchema)
async def get_gallery_item(item_id: int, db: Session = Depends(get_db)):
    """Get gallery item by ID"""
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.post("/", response_model=GalleryItemSchema)
async def create_gallery_item(
    item_data: GalleryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new gallery item (admin only)"""
    db_item = GalleryItem(**item_data.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.post("/upload", response_model=APIResponse)
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: str = "",
    description: str = "",
    category: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Upload a new gallery image (admin only)"""
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.upload_dir, "gallery", filename)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create gallery item
    image_url = f"/uploads/gallery/{filename}"
    db_item = GalleryItem(
        title=title or file.filename,
        description=description,
        image_url=image_url,
        category=category or "general"
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return APIResponse(
        success=True,
        message="Image uploaded successfully",
        data={
            "id": db_item.id,
            "image_url": image_url
        }
    )


@router.delete("/{item_id}", response_model=APIResponse)
async def delete_gallery_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete gallery item (admin only)"""
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    # Delete file if exists
    if item.image_url.startswith('/uploads/'):
        file_path = os.path.join(settings.upload_dir, item.image_url[9:])  # Remove '/uploads/'
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(item)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Gallery item deleted successfully"
    )


@router.get("/categories", response_model=List[str])
async def get_gallery_categories(db: Session = Depends(get_db)):
    """Get list of available gallery categories"""
    categories = db.query(GalleryItem.category).distinct().all()
    return [category[0] for category in categories if category[0]]