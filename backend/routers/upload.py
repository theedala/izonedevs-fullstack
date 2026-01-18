from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid
import base64
from PIL import Image
from io import BytesIO
from typing import Optional

from database import get_db, User
from schemas import APIResponse
from auth import get_current_active_user
from config import settings

router = APIRouter()

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_FILE_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".zip"}


def validate_file_size(file: UploadFile):
    """Validate file size"""
    if hasattr(file, 'size') and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size} bytes"
        )


def validate_file_type(filename: str, allowed_extensions: set):
    """Validate file extension"""
    file_extension = os.path.splitext(filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    return file_extension


def resize_image(image_path: str, max_size: tuple = (1200, 1200)):
    """Resize image if it's too large"""
    try:
        with Image.open(image_path) as img:
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                img.save(image_path, optimize=True, quality=85)
    except Exception as e:
        print(f"Error resizing image {image_path}: {e}")


@router.post("/image", response_model=APIResponse)
async def upload_image(
    file: UploadFile = File(...),
    category: str = Form("general"),
    resize: bool = Form(True),
    current_user: User = Depends(get_current_active_user)
):
    """Upload an image file and return as base64 data URL"""
    validate_file_size(file)
    file_extension = validate_file_type(file.filename, ALLOWED_IMAGE_EXTENSIONS)
    
    try:
        # Read file content
        content = await file.read()
        
        # Resize image if requested
        if resize:
            img = Image.open(BytesIO(content))
            if img.size[0] > 1200 or img.size[1] > 1200:
                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                buffer = BytesIO()
                # Convert to RGB if image has alpha channel
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                img.save(buffer, format='JPEG', optimize=True, quality=85)
                content = buffer.getvalue()
        
        # Convert to base64
        base64_image = base64.b64encode(content).decode('utf-8')
        
        # Determine MIME type
        mime_type = "image/jpeg"
        if file_extension in [".png"]:
            mime_type = "image/png"
        elif file_extension in [".gif"]:
            mime_type = "image/gif"
        elif file_extension in [".webp"]:
            mime_type = "image/webp"
        
        # Create data URL
        image_url = f"data:{mime_type};base64,{base64_image}"
        
        return APIResponse(
            success=True,
            message="Image uploaded successfully",
            data={
                "filename": file.filename,
                "url": image_url,
                "category": category
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.post("/avatar", response_model=APIResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload user avatar"""
    validate_file_size(file)
    file_extension = validate_file_type(file.filename, ALLOWED_IMAGE_EXTENSIONS)
    
    # Generate unique filename with user ID
    filename = f"avatar_{current_user.id}_{uuid.uuid4()}{file_extension}"
    
    # Create avatars directory
    upload_path = os.path.join(settings.upload_dir, "avatars")
    os.makedirs(upload_path, exist_ok=True)
    
    file_path = os.path.join(upload_path, filename)
    
    try:
        # Remove old avatar if exists
        if current_user.avatar_url and current_user.avatar_url.startswith('/uploads/'):
            old_file_path = os.path.join(settings.upload_dir, current_user.avatar_url[9:])
            if os.path.exists(old_file_path):
                os.remove(old_file_path)
        
        # Save new avatar
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Resize to avatar size (square)
        resize_image(file_path, max_size=(400, 400))
        
        avatar_url = f"/uploads/avatars/{filename}"
        
        # Update user avatar URL
        current_user.avatar_url = avatar_url
        db.commit()
        
        return APIResponse(
            success=True,
            message="Avatar uploaded successfully",
            data={
                "avatar_url": avatar_url
            }
        )
    
    except Exception as e:
        # Clean up file if something went wrong
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")