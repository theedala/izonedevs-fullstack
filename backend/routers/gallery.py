from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid


from database import get_db, GalleryItem, User
from schemas import (
    GalleryItem as GalleryItemSchema, 
    GalleryItemCreate, 
    APIResponse,
    PaginatedResponse
)
from auth import require_admin
from storage import object_storage
from upload import read_upload, resize_image_bytes, safe_path_segment

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
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


@router.post("", response_model=GalleryItemSchema)
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


@router.post('/upload', response_model=APIResponse)
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: str = Form(''),
    description: str = Form(''),
    category: str = Form('general'),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Upload a resized gallery image to MinIO or the configured local fallback."""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='File must be an image')
    try:
        content, content_type = resize_image_bytes(await read_upload(file))
        safe_category = safe_path_segment(category, 'general')
        image_url = object_storage.put_bytes(content, f'gallery/{safe_category}/{uuid.uuid4()}.jpg', content_type)
        db_item = GalleryItem(
            title=title or file.filename or 'Gallery image',
            description=description,
            image_url=image_url,
            category=category or 'general',
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return APIResponse(success=True, message='Image uploaded successfully', data={'id': db_item.id, 'image_url': image_url})
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f'Failed to process image: {error}')


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
    
    object_storage.delete_url(item.image_url)
    
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