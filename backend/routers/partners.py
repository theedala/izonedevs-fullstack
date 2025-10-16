from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, Partner
from schemas import PartnerCreate, Partner as PartnerSchema, APIResponse, PaginatedResponse
from auth import require_admin, get_current_active_user

router = APIRouter()


@router.get("", response_model=PaginatedResponse[PartnerSchema])
async def get_partners(
    page: int = 1,
    size: int = 20,
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get paginated list of partners"""
    query = db.query(Partner)
    
    if category:
        query = query.filter(Partner.category == category)
    if is_active is not None:
        query = query.filter(Partner.is_active == is_active)
    if featured is not None:
        query = query.filter(Partner.featured == featured)
    
    query = query.order_by(Partner.featured.desc(), Partner.created_at.desc())
    
    total = query.count()
    partners = query.offset((page - 1) * size).limit(size).all()
    
    return PaginatedResponse(
        items=partners,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


@router.get("/{partner_id}", response_model=PartnerSchema)
async def get_partner(partner_id: int, db: Session = Depends(get_db)):
    """Get a specific partner by ID"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return partner


@router.post("", response_model=APIResponse)
async def create_partner(
    partner_data: PartnerCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Create a new partner (admin only)"""
    partner = Partner(**partner_data.dict())
    db.add(partner)
    db.commit()
    db.refresh(partner)
    
    return APIResponse(
        success=True,
        message="Partner created successfully",
        data={"partner_id": partner.id}
    )


@router.put("/{partner_id}", response_model=APIResponse)
async def update_partner(
    partner_id: int,
    partner_data: PartnerCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update a partner (admin only)"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    for field, value in partner_data.dict().items():
        setattr(partner, field, value)
    
    db.commit()
    return APIResponse(
        success=True,
        message="Partner updated successfully"
    )


@router.delete("/{partner_id}", response_model=APIResponse)
async def delete_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Delete a partner (admin only)"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    db.delete(partner)
    db.commit()
    
    return APIResponse(
        success=True,
        message="Partner deleted successfully"
    )


@router.patch("/{partner_id}/toggle-featured", response_model=APIResponse)
async def toggle_partner_featured(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Toggle partner featured status (admin only)"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    partner.featured = not partner.featured
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Partner {'featured' if partner.featured else 'unfeatured'} successfully"
    )


@router.patch("/{partner_id}/toggle-active", response_model=APIResponse)
async def toggle_partner_active(
    partner_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Toggle partner active status (admin only)"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    partner.is_active = not partner.is_active
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Partner {'activated' if partner.is_active else 'deactivated'} successfully"
    )