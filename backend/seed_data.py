"""
Seed data script for iZonehub Makerspace
Run this script to populate the database with initial data
"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json

from database import SessionLocal, User, Community, Project, Event, BlogPost, Product, GalleryItem, Tag
from auth import get_password_hash

def create_admin_user(db: Session):
    """Create an admin user"""
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            email="admin@izonedevs.com",
            username="admin",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            bio="System administrator for iZonehub Makerspace",
            skills='["Python", "JavaScript", "System Administration", "Project Management"]',
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        print("✅ Admin user created (username: admin, password: admin123)")
    else:
        print("ℹ️ Admin user already exists")
    
    return admin_user

def create_sample_users(db: Session):
    """Create sample users"""
    sample_users = [
        {
            "email": "john.doe@example.com",
            "username": "johndoe",
            "full_name": "John Doe",
            "bio": "Full-stack developer passionate about open source",
            "skills": '["JavaScript", "React", "Node.js", "Python"]'
        },
        {
            "email": "jane.smith@example.com", 
            "username": "janesmith",
            "full_name": "Jane Smith",
            "bio": "UI/UX designer and frontend developer",
            "skills": '["Design", "Figma", "React", "CSS"]'
        },
        {
            "email": "mike.tech@example.com",
            "username": "miketech", 
            "full_name": "Mike Johnson",
            "bio": "Electronics engineer and maker",
            "skills": '["Arduino", "Raspberry Pi", "3D Printing", "Electronics"]'
        }
    ]
    
    created_users = []
    for user_data in sample_users:
        existing_user = db.query(User).filter(User.username == user_data["username"]).first()
        if not existing_user:
            user = User(
                **user_data,
                hashed_password=get_password_hash("password123"),
                role="member",
                is_verified=True
            )
            db.add(user)
            created_users.append(user)
    
    db.commit()
    print(f"✅ Created {len(created_users)} sample users")
    return created_users

def create_communities(db: Session):
    """Create sample communities"""
    communities_data = [
        {
            "name": "Software Development Community",
            "description": "The Software Development Community (SDC) Programs at iZonehub Makerspace are designed to foster a collaborative and innovative environment for software developers of all skill levels. Our programs aim to build a strong community where developers can share knowledge, resources, and support to enhance their skills and advance their careers.",
            "category": "technology",
            "member_count": 150
        },
        {
            "name": "Hardware Development Community", 
            "description": "Join our Hardware Development Community to collaborate on innovative projects and push the boundaries of hardware technology. Engage with like-minded enthusiasts through workshops, hackathons, and hands-on projects. Access state-of-the-art tools and resources to turn your hardware ideas into reality.",
            "category": "hardware",
            "member_count": 120
        }
    ]
    
    created_communities = []
    for community_data in communities_data:
        existing = db.query(Community).filter(Community.name == community_data["name"]).first()
        if not existing:
            community = Community(**community_data)
            db.add(community)
            created_communities.append(community)
    
    db.commit()
    print(f"✅ Created {len(created_communities)} communities")
    return created_communities

def create_projects(db: Session, users, communities):
    """Create sample projects"""
    projects_data = [
        {
            "title": "iZoneDevs Website",
            "description": "The official website for iZonehub Makerspace built with React and FastAPI",
            "content": "A modern, responsive website showcasing our makerspace community...",
            "github_url": "https://github.com/izonedevs/website",
            "demo_url": "https://izonedevs.com",
            "difficulty": "intermediate",
            "status": "active",
            "featured": True
        },
        {
            "title": "IoT Weather Station",
            "description": "Arduino-based weather monitoring system with web dashboard",
            "content": "Complete weather station using ESP32, various sensors, and real-time data visualization...",
            "github_url": "https://github.com/izonedevs/weather-station",
            "difficulty": "beginner",
            "status": "completed",
            "featured": True
        },
        {
            "title": "Community Chat Bot",
            "description": "AI-powered chatbot to help community members find resources and answers",
            "content": "Intelligent bot built with Python and natural language processing...",
            "github_url": "https://github.com/izonedevs/chatbot",
            "difficulty": "advanced",
            "status": "active",
            "featured": False
        }
    ]
    
    created_projects = []
    for i, project_data in enumerate(projects_data):
        existing = db.query(Project).filter(Project.title == project_data["title"]).first()
        if not existing:
            project = Project(
                **project_data,
                creator_id=users[i % len(users)].id if users else 1,
                community_id=communities[i % len(communities)].id if communities else None
            )
            db.add(project)
            created_projects.append(project)
    
    db.commit()
    print(f"✅ Created {len(created_projects)} projects")
    return created_projects

def create_events(db: Session, communities):
    """Create sample events"""
    base_date = datetime.now()
    events_data = [
        {
            "title": "React Workshop: Building Modern UIs",
            "description": "Learn to build beautiful, responsive user interfaces with React and modern CSS",
            "content": "Join us for a hands-on workshop where you'll learn...",
            "start_date": base_date + timedelta(days=7, hours=14),
            "end_date": base_date + timedelta(days=7, hours=17),
            "location": "iZonehub Main Lab",
            "max_attendees": 25,
            "registration_fee": 0.0,
            "status": "upcoming",
            "featured": True
        },
        {
            "title": "3D Printing Basics",
            "description": "Introduction to 3D printing, design principles, and hands-on printing",
            "content": "Learn the fundamentals of 3D printing technology...",
            "start_date": base_date + timedelta(days=14, hours=10),
            "end_date": base_date + timedelta(days=14, hours=16),
            "location": "iZonehub Maker Lab",
            "max_attendees": 15,
            "registration_fee": 10.0,
            "status": "upcoming",
            "featured": True
        },
        {
            "title": "Open Source Contribution Workshop",
            "description": "Learn how to contribute to open source projects and make an impact",
            "content": "A comprehensive guide to getting started with open source...",
            "start_date": base_date + timedelta(days=21, hours=15),
            "end_date": base_date + timedelta(days=21, hours=18),
            "location": "Online",
            "is_online": True,
            "meeting_url": "https://meet.izonedevs.com/opensource",
            "max_attendees": 50,
            "registration_fee": 0.0,
            "status": "upcoming",
            "featured": False
        }
    ]
    
    created_events = []
    for i, event_data in enumerate(events_data):
        existing = db.query(Event).filter(Event.title == event_data["title"]).first()
        if not existing:
            event = Event(
                **event_data,
                community_id=communities[i % len(communities)].id if communities else None
            )
            db.add(event)
            created_events.append(event)
    
    db.commit()
    print(f"✅ Created {len(created_events)} events")
    return created_events

def create_blog_posts(db: Session, users):
    """Create sample blog posts"""
    blog_posts_data = [
        {
            "title": "Welcome to iZonehub Makerspace",
            "slug": "welcome-to-izonehub-makerspace",
            "excerpt": "Introducing Zimbabwe's premier makerspace for innovators, developers, and creators.",
            "content": "We're excited to announce the launch of iZonehub Makerspace...",
            "status": "published",
            "featured": True,
            "published_at": datetime.now() - timedelta(days=30)
        },
        {
            "title": "Building the Future: Our Mission and Vision",
            "slug": "building-the-future-our-mission-and-vision", 
            "excerpt": "Learn about our goals to empower the next generation of Zimbabwean innovators.",
            "content": "At iZonehub, we believe in the power of community-driven innovation...",
            "status": "published",
            "featured": True,
            "published_at": datetime.now() - timedelta(days=20)
        },
        {
            "title": "10 Tips for New Makers",
            "slug": "10-tips-for-new-makers",
            "excerpt": "Essential advice for anyone starting their maker journey.",
            "content": "Whether you're interested in electronics, 3D printing, or software development...",
            "status": "published",
            "featured": False,
            "published_at": datetime.now() - timedelta(days=10)
        }
    ]
    
    created_posts = []
    for i, post_data in enumerate(blog_posts_data):
        existing = db.query(BlogPost).filter(BlogPost.slug == post_data["slug"]).first()
        if not existing:
            post = BlogPost(
                **post_data,
                author_id=users[i % len(users)].id if users else 1,
                views=50 + (i * 25)
            )
            db.add(post)
            created_posts.append(post)
    
    db.commit()
    print(f"✅ Created {len(created_posts)} blog posts")
    return created_posts

def create_products(db: Session):
    """Create sample products"""
    products_data = [
        {
            "name": "Arduino Starter Kit",
            "description": "Complete Arduino kit with sensors, LEDs, resistors, and project guide",
            "price": 45.00,
            "category": "electronics",
            "stock_quantity": 15,
            "featured": True
        },
        {
            "name": "3D Printing Filament - PLA",
            "description": "High-quality PLA filament in various colors, perfect for 3D printing projects",
            "price": 25.00,
            "category": "3d-printing",
            "stock_quantity": 30,
            "featured": True
        },
        {
            "name": "Raspberry Pi 4 Kit",
            "description": "Complete Raspberry Pi 4 kit with case, power supply, and SD card",
            "price": 85.00,
            "category": "electronics", 
            "stock_quantity": 10,
            "featured": False
        },
        {
            "name": "iZonehub T-Shirt",
            "description": "Official iZonehub merchandise - comfortable cotton t-shirt",
            "price": 15.00,
            "category": "merchandise",
            "stock_quantity": 50,
            "featured": False
        }
    ]
    
    created_products = []
    for product_data in products_data:
        existing = db.query(Product).filter(Product.name == product_data["name"]).first()
        if not existing:
            product = Product(**product_data)
            db.add(product)
            created_products.append(product)
    
    db.commit()
    print(f"✅ Created {len(created_products)} products")
    return created_products

def create_gallery_items(db: Session):
    """Create sample gallery items"""
    gallery_data = [
        {
            "title": "Makerspace Lab",
            "description": "Our main workspace with 3D printers, electronics stations, and collaboration areas",
            "image_url": "/uploads/gallery/makerspace-lab.jpg",
            "category": "workspace",
            "featured": True
        },
        {
            "title": "Community Event",
            "description": "Photos from our recent React workshop with enthusiastic participants",
            "image_url": "/uploads/gallery/react-workshop.jpg",
            "category": "events",
            "featured": True
        },
        {
            "title": "Student Projects",
            "description": "Amazing projects created by our community members",
            "image_url": "/uploads/gallery/student-projects.jpg",
            "category": "projects",
            "featured": False
        }
    ]
    
    created_items = []
    for item_data in gallery_data:
        existing = db.query(GalleryItem).filter(GalleryItem.title == item_data["title"]).first()
        if not existing:
            item = GalleryItem(**item_data)
            db.add(item)
            created_items.append(item)
    
    db.commit()
    print(f"✅ Created {len(created_items)} gallery items")
    return created_items

def main():
    """Run the seed data script"""
    print("🌱 Starting database seeding...")
    
    db = SessionLocal()
    try:
        # Create admin user first
        admin_user = create_admin_user(db)
        
        # Create sample users
        users = create_sample_users(db)
        all_users = [admin_user] + users
        
        # Create communities
        communities = create_communities(db)
        
        # Create projects
        projects = create_projects(db, all_users, communities)
        
        # Create events
        events = create_events(db, communities)
        
        # Create blog posts
        blog_posts = create_blog_posts(db, all_users)
        
        # Create products
        products = create_products(db)
        
        # Create gallery items
        gallery_items = create_gallery_items(db)
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📝 Summary:")
        print(f"   Users: {len(all_users)} (including admin)")
        print(f"   Communities: {len(communities)}")
        print(f"   Projects: {len(projects)}")
        print(f"   Events: {len(events)}")
        print(f"   Blog Posts: {len(blog_posts)}")
        print(f"   Products: {len(products)}")
        print(f"   Gallery Items: {len(gallery_items)}")
        print("\n🔑 Admin Login:")
        print("   Username: admin")
        print("   Password: admin123")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()