"""
Migration: Change image_url column to LONGTEXT for base64 storage
"""
from sqlalchemy import create_engine, text
from config import settings

def migrate():
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("Migrating image_url columns to LONGTEXT...")
        
        try:
            # Migrate blog_posts table
            conn.execute(text("""
                ALTER TABLE blog_posts 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated blog_posts.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating blog_posts: {e}")
            conn.rollback()
        
        try:
            # Migrate other tables that might have images
            conn.execute(text("""
                ALTER TABLE products 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated products.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating products: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE events 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated events.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating events: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE projects 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated projects.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating projects: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE communities 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated communities.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating communities: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE gallery_items 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated gallery_items.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating gallery_items: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE team_members 
                MODIFY COLUMN image_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated team_members.image_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating team_members: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE partners 
                MODIFY COLUMN logo_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated partners.logo_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating partners: {e}")
            conn.rollback()
        
        try:
            conn.execute(text("""
                ALTER TABLE users 
                MODIFY COLUMN avatar_url LONGTEXT
            """))
            conn.commit()
            print("✓ Migrated users.avatar_url to LONGTEXT")
            
        except Exception as e:
            print(f"Error migrating users: {e}")
            conn.rollback()
        
        print("\nMigration completed!")

if __name__ == "__main__":
    migrate()
