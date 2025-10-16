from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from config import settings

# Create engine
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Association tables for many-to-many relationships
user_communities = Table(
    'user_communities',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('community_id', Integer, ForeignKey('communities.id'), primary_key=True)
)

project_tags = Table(
    'project_tags',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

event_attendees = Table(
    'event_attendees',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True)
)


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string
    role = Column(String, default="member")  # admin, moderator, member
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    communities = relationship("Community", secondary=user_communities, back_populates="members")
    projects = relationship("Project", back_populates="creator")
    blog_posts = relationship("BlogPost", back_populates="author")
    events_attending = relationship("Event", secondary=event_attendees, back_populates="attendees")
    comments = relationship("Comment", back_populates="author")
    orders = relationship("Order", back_populates="user")


class Community(Base):
    __tablename__ = "communities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=False)  # tech, design, maker, etc.
    member_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    members = relationship("User", secondary=user_communities, back_populates="communities")
    projects = relationship("Project", back_populates="community")
    events = relationship("Event", back_populates="community")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=True)  # Detailed project content
    image_url = Column(String, nullable=True)
    gallery_images = Column(Text, nullable=True)  # JSON array of image URLs
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    technologies = Column(Text, nullable=True)  # JSON array of technologies
    category = Column(String, nullable=True)  # web, mobile, iot, ai, etc.
    status = Column(String, default="in_progress")  # planning, in_progress, completed, on_hold
    difficulty = Column(String, nullable=True)  # beginner, intermediate, advanced
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"))
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    
    # Relationships
    creator = relationship("User", back_populates="projects")
    community = relationship("Community", back_populates="projects")
    tags = relationship("Tag", secondary=project_tags, back_populates="projects")
    comments = relationship("Comment", back_populates="project")


class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    location = Column(String, nullable=True)
    is_online = Column(Boolean, default=False)
    meeting_url = Column(String, nullable=True)
    max_attendees = Column(Integer, nullable=True)
    registration_fee = Column(Float, default=0.0)
    status = Column(String, default="upcoming")  # upcoming, ongoing, completed, cancelled
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    
    # Relationships
    community = relationship("Community", back_populates="events")
    attendees = relationship("User", secondary=event_attendees, back_populates="events_attending")
    registrations = relationship("EventRegistration", back_populates="event")


class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    status = Column(String, default="draft")  # draft, published, archived
    featured = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime, nullable=True)
    
    # Foreign keys
    author_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    author = relationship("User", back_populates="blog_posts")
    comments = relationship("Comment", back_populates="blog_post")


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    gallery_images = Column(Text, nullable=True)  # JSON array
    category = Column(String, nullable=False)
    stock_quantity = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, shipped, delivered, cancelled
    shipping_address = Column(Text, nullable=False)
    contact_info = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    
    # Foreign keys
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    color = Column(String, nullable=True)
    
    # Relationships
    projects = relationship("Project", secondary=project_tags, back_populates="tags")


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    author_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=True)
    
    # Relationships
    author = relationship("User", back_populates="comments")
    project = relationship("Project", back_populates="comments")
    blog_post = relationship("BlogPost", back_populates="comments")


class GalleryItem(Base):
    __tablename__ = "gallery_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    category = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String, default="medium")  # low, medium, high
    is_read = Column(Boolean, default=False)
    status = Column(String, default="unread")  # unread, read, replied
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EventRegistration(Base):
    __tablename__ = "event_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)  # beginner, intermediate, advanced
    interests = Column(Text, nullable=True)
    dietary_restrictions = Column(String, nullable=True)
    special_requirements = Column(Text, nullable=True)
    qr_code_path = Column(String, nullable=True)  # Path to generated QR code
    registration_status = Column(String, default="confirmed")  # confirmed, cancelled, attended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to event
    event = relationship("Event", back_populates="registrations")


class Partner(Base):
    __tablename__ = "partners"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    category = Column(String, nullable=True)  # tech, education, government, ngo, etc.
    is_active = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    order_priority = Column(Integer, default=0)  # For custom ordering
    created_at = Column(DateTime(timezone=True), server_default=func.now())


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()