from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db, User
from schemas import APIResponse
from auth import require_admin

router = APIRouter()


@router.post("/migrate-image-columns", response_model=APIResponse)
async def migrate_image_columns(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Migrate image_url columns to LONGTEXT for base64 support (admin only, one-time)"""
    
    migrations = []
    errors = []
    
    tables_to_migrate = [
        "blog_posts",
        "products", 
        "events",
        "projects",
        "communities",
        "gallery_items",
        "team_members",
        "users"
    ]
    
    for table in tables_to_migrate:
        try:
            column = "logo_url" if table == "partners" else ("avatar_url" if table == "users" else "image_url")
            db.execute(text(f"ALTER TABLE {table} MODIFY COLUMN {column} LONGTEXT"))
            db.commit()
            migrations.append(f"✓ Migrated {table}.{column}")
        except Exception as e:
            error_msg = f"✗ Error migrating {table}: {str(e)}"
            errors.append(error_msg)
            db.rollback()
    
    # Also migrate partners.logo_url
    try:
        db.execute(text("ALTER TABLE partners MODIFY COLUMN logo_url LONGTEXT"))
        db.commit()
        migrations.append("✓ Migrated partners.logo_url")
    except Exception as e:
        errors.append(f"✗ Error migrating partners: {str(e)}")
        db.rollback()
    
    return APIResponse(
        success=len(errors) == 0,
        message=f"Migration completed. {len(migrations)} successful, {len(errors)} errors.",
        data={
            "migrations": migrations,
            "errors": errors
        }
    )
