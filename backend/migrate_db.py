#!/usr/bin/env python3
"""
Migrate database to add new columns for admin functionality
"""

import sqlite3
import json

def migrate_database():
    """Add new columns to existing database"""
    conn = sqlite3.connect('izonedevs.db')
    cursor = conn.cursor()
    
    try:
        print("🔄 Adding new columns to database...")
        
        # Add new columns to projects table
        try:
            cursor.execute("ALTER TABLE projects ADD COLUMN technologies TEXT")
            print("✅ Added technologies column to projects")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ Technologies column already exists")
            else:
                print(f"❌ Error adding technologies column: {e}")
        
        try:
            cursor.execute("ALTER TABLE projects ADD COLUMN category TEXT")
            print("✅ Added category column to projects")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ Category column already exists")
            else:
                print(f"❌ Error adding category column: {e}")
        
        # Add new columns to contact_messages table
        try:
            cursor.execute("ALTER TABLE contact_messages ADD COLUMN phone TEXT")
            print("✅ Added phone column to contact_messages")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ Phone column already exists")
            else:
                print(f"❌ Error adding phone column: {e}")
        
        try:
            cursor.execute("ALTER TABLE contact_messages ADD COLUMN company TEXT")
            print("✅ Added company column to contact_messages")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ Company column already exists")
            else:
                print(f"❌ Error adding company column: {e}")
        
        try:
            cursor.execute("ALTER TABLE contact_messages ADD COLUMN priority TEXT DEFAULT 'medium'")
            print("✅ Added priority column to contact_messages")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ Priority column already exists")
            else:
                print(f"❌ Error adding priority column: {e}")
        
        try:
            cursor.execute("ALTER TABLE contact_messages ADD COLUMN is_read BOOLEAN DEFAULT 0")
            print("✅ Added is_read column to contact_messages")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print("⚠️ is_read column already exists")
            else:
                print(f"❌ Error adding is_read column: {e}")
        
        # Update existing data with default values
        print("\n🔄 Updating existing data with default values...")
        
        # Update projects with default technologies and categories
        cursor.execute("""
            UPDATE projects 
            SET technologies = '["Web Development", "React", "Python"]',
                category = 'web'
            WHERE technologies IS NULL OR category IS NULL
        """)
        
        # Update project status values
        cursor.execute("UPDATE projects SET status = 'in_progress' WHERE status = 'active'")
        cursor.execute("UPDATE projects SET status = 'on_hold' WHERE status = 'paused'")
        
        # Update contact messages with default values
        cursor.execute("""
            UPDATE contact_messages 
            SET priority = 'medium',
                is_read = CASE WHEN status = 'read' THEN 1 ELSE 0 END
            WHERE priority IS NULL
        """)
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()