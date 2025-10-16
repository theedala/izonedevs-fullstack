from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json

from database import SessionLocal, User, Community, Project, Event, BlogPost, Product, GalleryItem, Tag
from auth import get_password_hash


def create_sample_data():
    """Create sample data for development"""
    db = SessionLocal()
    
    try:
        # Create admin user
        admin_user = User(
            email="admin@izonedevs.com",
            username="admin",
            full_name="iZone Administrator",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            bio="System administrator for iZonehub Makerspace",
            skills=json.dumps(["Python", "React", "System Administration"]),
            is_active=True,
            is_verified=True
        )
        db.add(admin_user)
        
        # Create sample users
        users_data = [
            {
                "email": "john.doe@example.com",
                "username": "johndoe",
                "full_name": "John Doe",
                "bio": "Full-stack developer passionate about IoT and robotics",
                "skills": json.dumps(["Python", "JavaScript", "Arduino", "3D Printing"])
            },
            {
                "email": "jane.smith@example.com", 
                "username": "janesmith",
                "full_name": "Jane Smith",
                "bio": "UI/UX designer and frontend developer",
                "skills": json.dumps(["Figma", "React", "CSS", "User Research"])
            },
            {
                "email": "mike.wilson@example.com",
                "username": "mikewilson", 
                "full_name": "Mike Wilson",
                "bio": "Hardware engineer and maker enthusiast",
                "skills": json.dumps(["Electronics", "PCB Design", "Soldering", "Microcontrollers"])
            }
        ]
        
        sample_users = []
        for user_data in users_data:
            user = User(
                **user_data,
                hashed_password=get_password_hash("password123"),
                role="member",
                is_active=True,
                is_verified=True
            )
            db.add(user)
            sample_users.append(user)
        
        db.commit()  # Commit users first to get IDs
        
        # Create communities
        communities_data = [
            {
                "name": "Web Development",
                "description": "Learn and build modern web applications using React, Node.js, and other cutting-edge technologies.",
                "category": "technology",
                "member_count": 25
            },
            {
                "name": "3D Printing & Maker",
                "description": "Explore 3D printing, CNC machining, and digital fabrication techniques.",
                "category": "maker",
                "member_count": 18
            },
            {
                "name": "IoT & Electronics",
                "description": "Build connected devices and learn electronics from Arduino to advanced microcontrollers.",
                "category": "electronics",
                "member_count": 22
            },
            {
                "name": "Design & UX",
                "description": "Create beautiful user experiences and learn design thinking principles.",
                "category": "design",
                "member_count": 15
            }
        ]
        
        communities = []
        for comm_data in communities_data:
            community = Community(**comm_data)
            db.add(community)
            communities.append(community)
        
        db.commit()
        
        # Create tags
        tags_data = [
            {"name": "Web Development", "color": "#3B82F6"},
            {"name": "React", "color": "#06B6D4"},
            {"name": "Python", "color": "#10B981"},
            {"name": "Arduino", "color": "#F59E0B"},
            {"name": "3D Printing", "color": "#8B5CF6"},
            {"name": "IoT", "color": "#EC4899"},
            {"name": "Machine Learning", "color": "#6366F1"},
            {"name": "Mobile App", "color": "#EF4444"}
        ]
        
        tags = []
        for tag_data in tags_data:
            tag = Tag(**tag_data)
            db.add(tag)
            tags.append(tag)
        
        db.commit()
        
        # Create projects
        projects_data = [
            {
                "title": "Smart Home Automation System",
                "description": "A complete IoT solution for home automation using ESP32, sensors, and a React dashboard.",
                "content": "This project demonstrates how to build a comprehensive smart home system...",
                "creator_id": sample_users[0].id,
                "community_id": communities[2].id,
                "difficulty": "intermediate",
                "status": "active",
                "featured": True,
                "github_url": "https://github.com/example/smart-home",
                "demo_url": "https://smart-home-demo.com"
            },
            {
                "title": "E-commerce Website with React",
                "description": "Modern e-commerce platform built with React, Node.js, and MongoDB.",
                "content": "Learn to build a full-featured e-commerce website...",
                "creator_id": sample_users[1].id,
                "community_id": communities[0].id,
                "difficulty": "advanced",
                "status": "completed",
                "featured": True,
                "github_url": "https://github.com/example/ecommerce"
            },
            {
                "title": "3D Printed Robot Arm",
                "description": "Design and build a 6-DOF robot arm using 3D printing and Arduino control.",
                "content": "This project covers mechanical design, 3D printing, and programming...",
                "creator_id": sample_users[2].id,
                "community_id": communities[1].id,
                "difficulty": "advanced",
                "status": "active",
                "featured": False
            },
            {
                "title": "Mobile Weather App",
                "description": "Cross-platform weather application using React Native and weather APIs.",
                "content": "Build a beautiful weather app for iOS and Android...",
                "creator_id": sample_users[1].id,
                "community_id": communities[0].id,
                "difficulty": "beginner",
                "status": "active",
                "featured": False
            }
        ]
        
        for project_data in projects_data:
            project = Project(**project_data)
            db.add(project)
        
        db.commit()
        
        # Create events
        events_data = [
            {
                "title": "React Workshop: Building Modern UIs",
                "description": "Hands-on workshop covering React hooks, context, and modern development practices.",
                "content": "Join us for an intensive React workshop...",
                "start_date": datetime.now() + timedelta(days=7),
                "end_date": datetime.now() + timedelta(days=7, hours=4),
                "location": "iZonehub Main Lab",
                "is_online": False,
                "max_attendees": 20,
                "registration_fee": 25.0,
                "community_id": communities[0].id,
                "status": "upcoming",
                "featured": True
            },
            {
                "title": "3D Printing Masterclass",
                "description": "Learn advanced 3D printing techniques, troubleshooting, and post-processing.",
                "content": "Comprehensive guide to 3D printing...",
                "start_date": datetime.now() + timedelta(days=14),
                "end_date": datetime.now() + timedelta(days=14, hours=6),
                "location": "Maker Space",
                "is_online": False,
                "max_attendees": 15,
                "registration_fee": 30.0,
                "community_id": communities[1].id,
                "status": "upcoming",
                "featured": True
            },
            {
                "title": "IoT Security Best Practices",
                "description": "Online seminar covering security considerations for IoT projects.",
                "content": "Learn about IoT security...",
                "start_date": datetime.now() + timedelta(days=21),
                "end_date": datetime.now() + timedelta(days=21, hours=2),
                "is_online": True,
                "meeting_url": "https://meet.izonedevs.com/iot-security",
                "max_attendees": 50,
                "registration_fee": 0.0,
                "community_id": communities[2].id,
                "status": "upcoming",
                "featured": False
            }
        ]
        
        for event_data in events_data:
            event = Event(**event_data)
            db.add(event)
        
        db.commit()
        
        # Create blog posts
        blog_posts_data = [
            {
                "title": "Welcome to iZonehub Makerspace",
                "slug": "welcome-to-izonehub-makerspace",
                "excerpt": "Introducing Zimbabwe's premier innovation hub for makers, developers, and entrepreneurs.",
                "content": "We're excited to announce the official launch of iZonehub Makerspace...",
                "author_id": admin_user.id,
                "status": "published",
                "featured": True,
                "published_at": datetime.now() - timedelta(days=5),
                "views": 156
            },
            {
                "title": "Getting Started with Arduino in 2024",
                "slug": "getting-started-arduino-2024",
                "excerpt": "A comprehensive guide to starting your electronics journey with Arduino.",
                "content": "Arduino has revolutionized the way we approach electronics projects...",
                "author_id": sample_users[2].id,
                "status": "published",
                "featured": True,
                "published_at": datetime.now() - timedelta(days=10),
                "views": 89
            },
            {
                "title": "React Best Practices for 2024",
                "slug": "react-best-practices-2024",
                "excerpt": "Modern React development techniques and patterns you should know.",
                "content": "React continues to evolve with new features and best practices...",
                "author_id": sample_users[1].id,
                "status": "published",
                "featured": False,
                "published_at": datetime.now() - timedelta(days=15),
                "views": 67
            }
        ]
        
        for blog_data in blog_posts_data:
            blog_post = BlogPost(**blog_data)
            db.add(blog_post)
        
        db.commit()
        
        # Create products
        products_data = [
            {
                "name": "Arduino Uno R3",
                "description": "The classic Arduino board perfect for beginners and prototyping.",
                "price": 25.99,
                "category": "electronics",
                "stock_quantity": 15,
                "is_available": True,
                "featured": True
            },
            {
                "name": "3D Printer Filament - PLA",
                "description": "High-quality PLA filament available in multiple colors.",
                "price": 22.50,
                "category": "3d-printing",
                "stock_quantity": 30,
                "is_available": True,
                "featured": True
            },
            {
                "name": "Raspberry Pi 4 Model B",
                "description": "Latest Raspberry Pi with 4GB RAM for advanced projects.",
                "price": 75.00,
                "category": "electronics", 
                "stock_quantity": 8,
                "is_available": True,
                "featured": False
            },
            {
                "name": "iZonehub T-Shirt",
                "description": "Official iZonehub merchandise - comfortable cotton t-shirt.",
                "price": 15.00,
                "category": "merchandise",
                "stock_quantity": 25,
                "is_available": True,
                "featured": False
            }
        ]
        
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        
        # Create gallery items
        gallery_data = [
            {
                "title": "Makerspace Workshop Area",
                "description": "Our main workshop space equipped with 3D printers and electronics stations.",
                "image_url": "/uploads/gallery/workshop-area.jpg",
                "category": "facility",
                "featured": True
            },
            {
                "title": "Student Project Showcase",
                "description": "Amazing projects created by our community members.",
                "image_url": "/uploads/gallery/project-showcase.jpg", 
                "category": "projects",
                "featured": True
            },
            {
                "title": "Electronics Lab",
                "description": "Fully equipped electronics lab with oscilloscopes and testing equipment.",
                "image_url": "/uploads/gallery/electronics-lab.jpg",
                "category": "facility",
                "featured": False
            }
        ]
        
        for gallery_item_data in gallery_data:
            gallery_item = GalleryItem(**gallery_item_data)
            db.add(gallery_item)
        
        db.commit()
        
        print("✅ Sample data created successfully!")
        print(f"Created {len(users_data) + 1} users")
        print(f"Created {len(communities_data)} communities")
        print(f"Created {len(projects_data)} projects")
        print(f"Created {len(events_data)} events")
        print(f"Created {len(blog_posts_data)} blog posts")
        print(f"Created {len(products_data)} products")
        print(f"Created {len(gallery_data)} gallery items")
        print(f"Created {len(tags_data)} tags")
        
        print("\nDefault admin credentials:")
        print("Email: admin@izonedevs.com")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()