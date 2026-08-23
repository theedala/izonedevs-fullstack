from io import BytesIO
import os
import re
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from PIL import Image
from sqlalchemy.orm import Session

from auth import get_current_active_user
from config import settings
from database import User, get_db
from schemas import APIResponse
from storage import object_storage

router = APIRouter()
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_FILE_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.zip'}


def validate_file_size(file: UploadFile) -> None:
    if file.size is not None and file.size > settings.max_file_size:
        raise HTTPException(status_code=413, detail=f'File too large. Maximum size is {settings.max_file_size} bytes')


def safe_path_segment(value: str, fallback: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_-]+', '-', (value or '').strip()).strip('-_')
    return cleaned[:80] or fallback


async def read_upload(file: UploadFile) -> bytes:
    content = await file.read(settings.max_file_size + 1)
    if len(content) > settings.max_file_size:
        raise HTTPException(status_code=413, detail=f'File too large. Maximum size is {settings.max_file_size} bytes')
    return content


def validate_file_type(filename: str, allowed_extensions: set[str]) -> str:
    extension = os.path.splitext(filename)[1].lower()
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed types: {', '.join(sorted(allowed_extensions))}")
    return extension


def resize_image_bytes(content: bytes, max_size: tuple[int, int] = (1200, 1200)) -> tuple[bytes, str]:
    with Image.open(BytesIO(content)) as image:
        image.load()
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.convert('RGBA').size, (255, 255, 255))
            background.paste(image.convert('RGBA'), mask=image.convert('RGBA').getchannel('A'))
            image = background
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, format='JPEG', optimize=True, quality=85)
        return output.getvalue(), 'image/jpeg'


@router.post('/image', response_model=APIResponse)
async def upload_image(file: UploadFile = File(...), category: str = Form('general'), resize: bool = Form(True), current_user: User = Depends(get_current_active_user)):
    validate_file_size(file)
    filename = file.filename or 'upload.bin'
    extension = validate_file_type(filename, ALLOWED_IMAGE_EXTENSIONS)
    content = await read_upload(file)
    content_type = file.content_type or 'application/octet-stream'
    try:
        if resize:
            content, content_type = resize_image_bytes(content)
            extension = '.jpg'
        else:
            with Image.open(BytesIO(content)) as image:
                image.verify()
    except Exception as error:
        raise HTTPException(status_code=400, detail=f'Invalid image: {error}')
    object_name = f'images/{safe_path_segment(category, "general")}/{uuid.uuid4()}{extension}'
    try:
        image_url = object_storage.put_bytes(content, object_name, content_type)
        return APIResponse(success=True, message='Image uploaded successfully', data={'filename': os.path.basename(object_name), 'url': image_url, 'category': category})
    except Exception as error:
        raise HTTPException(status_code=500, detail=f'Failed to upload image: {error}')


@router.post('/avatar', response_model=APIResponse)
async def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    validate_file_size(file)
    filename = file.filename or 'avatar.jpg'
    extension = validate_file_type(filename, ALLOWED_IMAGE_EXTENSIONS)
    content = await read_upload(file)
    try:
        content, content_type = resize_image_bytes(content, (400, 400))
        object_name = f'avatars/avatar_{current_user.id}_{uuid.uuid4()}.jpg'
        object_storage.delete_url(current_user.avatar_url)
        avatar_url = object_storage.put_bytes(content, object_name, content_type)
        current_user.avatar_url = avatar_url
        db.commit()
        return APIResponse(success=True, message='Avatar uploaded successfully', data={'avatar_url': avatar_url})
    except Exception as error:
        raise HTTPException(status_code=500, detail=f'Failed to upload avatar: {error}')


@router.post('/file', response_model=APIResponse)
async def upload_file(file: UploadFile = File(...), category: str = Form('documents'), current_user: User = Depends(get_current_active_user)):
    validate_file_size(file)
    filename = file.filename or 'upload.bin'
    extension = validate_file_type(filename, ALLOWED_FILE_EXTENSIONS)
    content = await read_upload(file)
    object_name = f'files/{safe_path_segment(category, "documents")}/{uuid.uuid4()}{extension}'
    try:
        file_url = object_storage.put_bytes(content, object_name, file.content_type)
        return APIResponse(success=True, message='File uploaded successfully', data={'filename': os.path.basename(object_name), 'url': file_url, 'category': category, 'original_name': filename})
    except Exception as error:
        raise HTTPException(status_code=500, detail=f'Failed to upload file: {error}')
