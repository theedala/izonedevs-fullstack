import os
from sqlalchemy import create_engine, text

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

def migrate_image_columns():
    """Migrate image columns to LONGTEXT to support base64 images"""
    engine = create_engine(DATABASE_URL)
    
    migrations = [
        "ALTER TABLE blog_posts MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE products MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE events MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE projects MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE communities MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE gallery_items MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE team_members MODIFY COLUMN image_url LONGTEXT",
        "ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT",
        "ALTER TABLE partners MODIFY COLUMN logo_url LONGTEXT",
    ]
    
    with engine.connect() as conn:
        for migration in migrations:
            try:
                print(f"Executing: {migration}")
                conn.execute(text(migration))
                conn.commit()
                print(f"✓ Success")
            except Exception as e:
                print(f"✗ Error: {e}")
                continue
    
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate_image_columns()
