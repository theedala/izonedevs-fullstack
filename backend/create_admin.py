"""
Quick script to create secure admin users for iZonehub
Run this when you need to add admin users to the database
"""

import os
import secrets
import string
from sqlalchemy.orm import Session
from database import SessionLocal, User
from auth import get_password_hash

def generate_secure_password(length=16):
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%&*"
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def create_admin_users():
    """Create secure admin users in the database"""
    db = SessionLocal()
    
    # Define admin users with secure credentials
    admin_users = [
        {
            "username": "izonedevs_admin",
            "email": "izonedevs.admin@gmail.com",
            "full_name": "IzoneDevs Administrator",
            "bio": "Primary administrator for iZonehub Makerspace platform"
        },
        {
            "username": "izonedevs_super",
            "email": "izonedevs.superadmin@gmail.com", 
            "full_name": "IzoneDevs Super Admin",
            "bio": "Super administrator with full system access"
        }
    ]
    
    created_users = []
    
    try:
        for user_data in admin_users:
            # Check if user already exists
            existing_user = db.query(User).filter(User.username == user_data["username"]).first()
            
            if existing_user:
                print(f"ℹ️ User '{user_data['username']}' already exists")
                continue
            
            # Generate secure password
            secure_password = generate_secure_password()
            
            # Create new admin user
            admin_user = User(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(secure_password),
                role="admin",
                bio=user_data["bio"],
                skills='["System Administration", "Database Management", "Security", "Platform Management"]',
                is_verified=True
            )
            
            db.add(admin_user)
            db.commit()
            
            created_users.append({
                "username": user_data["username"],
                "password": secure_password,
                "email": user_data["email"],
                "full_name": user_data["full_name"]
            })
            
            print(f"✅ Admin user '{user_data['username']}' created successfully!")
        
        return created_users
        
    except Exception as e:
        print(f"❌ Error creating admin users: {e}")
        db.rollback()
        return []
    finally:
        db.close()

if __name__ == "__main__":
    print("🔐 Creating secure admin users for iZonehub...")
    print("=" * 60)
    
    created_users = create_admin_users()
    
    if created_users:
        print(f"\n🎉 Successfully created {len(created_users)} admin user(s)!")
        print("=" * 60)
        print("🔑 LOGIN CREDENTIALS (SAVE THESE SECURELY):")
        print("=" * 60)
        
        for i, user in enumerate(created_users, 1):
            print(f"\n👤 ADMIN USER {i}:")
            print(f"   Username: {user['username']}")
            print(f"   Password: {user['password']}")
            print(f"   Email: {user['email']}")
            print(f"   Name: {user['full_name']}")
        
        print("\n⚠️  IMPORTANT: Save these credentials in a secure password manager!")
        print("💡 Use these to login to your admin panel")
    else:
        print("\n❌ No new admin users were created")