from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Generic, TypeVar
from datetime import datetime
import json

T = TypeVar('T')


# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    bio: Optional[str] = None
    skills: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    avatar_url: Optional[str] = None


class UserInDB(UserBase):
    id: int
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class User(UserInDB):
    @field_validator('skills', mode='before')
    @classmethod
    def parse_skills(cls, v):
        if isinstance(v, str):
            try:
                return v  # Keep as string for User schema
            except (json.JSONDecodeError, TypeError):
                return v
        return v


# Community schemas
class CommunityBase(BaseModel):
    name: str
    description: str
    category: str
    image_url: Optional[str] = None


class CommunityCreate(CommunityBase):
    pass


class CommunityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class Community(CommunityBase):
    id: int
    member_count: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Project schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    technologies: Optional[List[str]] = []
    category: Optional[str] = None
    difficulty: Optional[str] = None


class ProjectCreate(ProjectBase):
    status: Optional[str] = "in_progress"
    featured: Optional[bool] = False
    community_id: Optional[int] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None


class Project(ProjectBase):
    id: int
    status: str
    featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    creator_id: int
    community_id: Optional[int] = None
    
    @field_validator('technologies', mode='before')
    @classmethod
    def parse_technologies(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v) if v else []
            except (json.JSONDecodeError, TypeError):
                return []
        return v if isinstance(v, list) else []
    
    class Config:
        from_attributes = True


# Event schemas
class EventBase(BaseModel):
    title: str
    description: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location: Optional[str] = None
    is_online: bool = False
    meeting_url: Optional[str] = None
    max_attendees: Optional[int] = None
    registration_fee: float = 0.0


class EventCreate(EventBase):
    community_id: Optional[int] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    is_online: Optional[bool] = None
    meeting_url: Optional[str] = None
    max_attendees: Optional[int] = None
    registration_fee: Optional[float] = None
    status: Optional[str] = None


class Event(EventBase):
    id: int
    status: str
    featured: bool
    created_at: datetime
    community_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# Event Registration schemas
class EventRegistrationBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    experience_level: Optional[str] = None
    interests: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    special_requirements: Optional[str] = None


class EventRegistrationCreate(EventRegistrationBase):
    pass


class EventRegistration(EventRegistrationBase):
    id: int
    event_id: int
    qr_code_path: Optional[str] = None
    registration_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class EventRegistrationWithEvent(EventRegistration):
    event: Event
    
    class Config:
        from_attributes = True


# Blog schemas
class BlogPostBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str
    image_url: Optional[str] = None


class BlogPostCreate(BlogPostBase):
    status: Optional[str] = "draft"


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class BlogPost(BlogPostBase):
    id: int
    slug: str
    status: str
    featured: bool
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    author_id: int
    
    class Config:
        from_attributes = True


# Product schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    category: str
    stock_quantity: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock_quantity: Optional[int] = None
    is_available: Optional[bool] = None


class Product(ProductBase):
    id: int
    is_available: bool
    featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Gallery schemas
class GalleryItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    category: Optional[str] = None


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItem(GalleryItemBase):
    id: int
    featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Contact schemas
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    subject: str
    message: str
    priority: Optional[str] = "medium"


class JoinApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    community: Optional[str] = None
    experience: Optional[str] = None
    interests: Optional[str] = None


class ContactMessage(ContactMessageCreate):
    id: int
    is_read: bool
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Partner schemas
class PartnerBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None


class PartnerCreate(PartnerBase):
    pass


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    featured: Optional[bool] = None


class Partner(PartnerBase):
    id: int
    is_active: bool
    featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Team Member schemas
class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None


class TeamMemberCreate(TeamMemberBase):
    order_priority: Optional[int] = 0


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    email: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_active: Optional[bool] = None
    order_priority: Optional[int] = None


class TeamMember(TeamMemberBase):
    id: int
    is_active: bool
    order_priority: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# API Response schemas
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int