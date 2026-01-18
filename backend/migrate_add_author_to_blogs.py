#!/usr/bin/env python3
"""
Migration script to add author column to blog_posts table
"""

from sqlalchemy import text
from database import engine, get_db

def migrate_add_author_column():
    """Add author column to blog_posts table"""
    
    with engine.connect() as connection:
        # Start transaction
        trans = connection.begin()
        
        try:
            # Check if column already exists
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_name = 'blog_posts' 
                AND column_name = 'author' 
                AND table_schema = DATABASE()
            """))
            
            column_exists = result.fetchone()[0] > 0
            
            if not column_exists:
                print("Adding 'author' column to blog_posts table...")
                
                # Add the author column
                connection.execute(text("""
                    ALTER TABLE blog_posts 
                    ADD COLUMN author VARCHAR(255) NOT NULL DEFAULT 'Unknown Author'
                """))
                
                print("✅ Author column added successfully!")
                
                # Update existing posts with a default author
                result = connection.execute(text("""
                    UPDATE blog_posts 
                    SET author = 'IzoneDevs Admin' 
                    WHERE author = 'Unknown Author'
                """))
                
                updated_count = result.rowcount
                print(f"✅ Updated {updated_count} existing blog posts with default author")
                
            else:
                print("✅ Author column already exists, skipping migration")
            
            # Commit transaction
            trans.commit()
            print("✅ Migration completed successfully!")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            trans.rollback()
            raise


if __name__ == "__main__":
    print("🚀 Starting blog posts author column migration...")
    migrate_add_author_column()
    print("🎉 Migration script completed!")