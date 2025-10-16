from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from database import get_db, Product, Order, OrderItem, User
from schemas import (
    Product as ProductSchema, 
    ProductCreate, 
    ProductUpdate, 
    APIResponse,
    PaginatedResponse
)
from auth import get_current_active_user, require_admin

router = APIRouter()


@router.get("/products", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    available: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of products"""
    query = db.query(Product)
    
    if category:
        query = query.filter(Product.category == category)
        
    if featured is not None:
        query = query.filter(Product.featured == featured)
        
    if available is not None:
        query = query.filter(Product.is_available == available)
    
    if search:
        query = query.filter(
            (Product.name.contains(search)) |
            (Product.description.contains(search))
        )
    
    total = query.count()
    products = query.order_by(Product.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[ProductSchema.from_orm(product).dict() for product in products],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/products/{product_id}", response_model=ProductSchema)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/products", response_model=ProductSchema)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new product (admin only)"""
    db_product = Product(**product_data.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/products/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product_update.dict(exclude_unset=True).items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", response_model=APIResponse)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Product deleted successfully"
    )


@router.get("/categories", response_model=List[str])
async def get_product_categories(db: Session = Depends(get_db)):
    """Get list of available product categories"""
    categories = db.query(Product.category).distinct().all()
    return [category[0] for category in categories if category[0]]


# Order endpoints would go here
# For brevity, I'm including a simplified version
@router.get("/orders/my", response_model=PaginatedResponse)
async def get_my_orders(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's orders"""
    query = db.query(Order).filter(Order.user_id == current_user.id)
    
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=[{
            "id": order.id,
            "order_number": order.order_number,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at
        } for order in orders],
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )