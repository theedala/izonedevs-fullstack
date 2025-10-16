#!/usr/bin/env python3
"""
Update database with new fields for admin functionality
"""

import json
from database import SessionLocal, Project, ContactMessage

def update_project_fields():
    """Add default values for new project fields"""
    db = SessionLocal()
    try:
        projects = db.query(Project).all()
        
        for project in projects:
            # Add default technologies if not set
            if not project.technologies:
                project.technologies = json.dumps(["Web Development", "React", "Python"])
            
            # Add default category if not set
            if not project.category:
                project.category = "web"
            
            # Update status values
            if project.status == "active":
                project.status = "in_progress"
            elif project.status == "completed":
                project.status = "completed"
            elif project.status == "paused":
                project.status = "on_hold"
        
        db.commit()
        print(f"✅ Updated {len(projects)} projects with new fields")
        
    except Exception as e:
        print(f"❌ Error updating projects: {e}")
        db.rollback()
    finally:
        db.close()

def update_contact_fields():
    """Add default values for new contact message fields"""
    db = SessionLocal()
    try:
        messages = db.query(ContactMessage).all()
        
        for message in messages:
            # Add default is_read field based on status
            if hasattr(message, 'status'):
                message.is_read = message.status == "read"
            else:
                message.is_read = False
            
            # Add default priority if not set
            if not hasattr(message, 'priority') or not message.priority:
                message.priority = "medium"
        
        db.commit()
        print(f"✅ Updated {len(messages)} contact messages with new fields")
        
    except Exception as e:
        print(f"❌ Error updating contact messages: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔄 Updating database fields...")
    update_project_fields()
    update_contact_fields()
    print("✅ Database update completed!")