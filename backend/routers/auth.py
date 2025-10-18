from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db, User
from schemas import UserCreate, User as UserSchema, Token, LoginRequest, APIResponse
from auth import (
    authenticate_user, 
    create_access_token, 
    create_refresh_token,
    get_password_hash,
    verify_token,
    require_admin
)
from config import settings

router = APIRouter()


@router.post("/register", response_model=APIResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Public user registration"""
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email or username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role="user",  # Default role for public registration
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return APIResponse(
        success=True,
        message="User registered successfully",
        data={"user_id": db_user.id}
    )


@router.post("/admin-create-user", response_model=APIResponse)
async def admin_create_user(user_data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Admin-only: Create a new user"""
    db_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email or username already exists"
        )
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return APIResponse(
        success=True,
        message="User registered successfully",
        data={"user_id": db_user.id}
    )


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user and return JWT tokens"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/login-json", response_model=Token)
async def login_json(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user with JSON data and return JWT tokens"""
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Create tokens
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        username = verify_token(refresh_token, credentials_exception)
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
    except:
        raise credentials_exception
    
    # Create new tokens
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    new_refresh_token = create_refresh_token(data={"sub": user.username})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )


@router.post("/bootstrap-admin", response_model=APIResponse)
async def bootstrap_admin(db: Session = Depends(get_db)):
    """One-time endpoint to upgrade first user to admin. Remove after use."""
    # Check if any admin exists
    admin_exists = db.query(User).filter(User.role == "admin").first()
    if admin_exists:
        raise HTTPException(
            status_code=400,
            detail="Admin user already exists. This endpoint is disabled."
        )
    
    # Get first user (ID 1)
    first_user = db.query(User).filter(User.id == 1).first()
    if not first_user:
        raise HTTPException(status_code=404, detail="No users found")
    
    # Upgrade to admin
    first_user.role = "admin"
    db.commit()
    db.refresh(first_user)
    
    return APIResponse(
        success=True,
        message=f"User '{first_user.username}' upgraded to admin successfully",
        data={"user_id": first_user.id, "role": first_user.role}
    )

@router.post("/reset-admin-password", response_model=APIResponse)
async def reset_admin_password(db: Session = Depends(get_db)):
    """One-time endpoint to reset admin password. Remove after use."""
    # Get user with username 'admin'
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        # Create admin user if doesn't exist
        from auth import get_password_hash
        admin_user = User(
            username="admin",
            email="admin@izonedevs.co.zw",
            full_name="Administrator",
            hashed_password=get_password_hash("Admin@iZone2025!"),
            role="admin",
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        return APIResponse(
            success=True,
            message="Admin user created successfully",
            data={"username": "admin", "password": "Admin@iZone2025!"}
        )
    
    # Reset password
    from auth import get_password_hash
    admin_user.hashed_password = get_password_hash("Admin@iZone2025!")
    admin_user.role = "admin"
    admin_user.is_active = True
    db.commit()
    
    return APIResponse(
        success=True,
        message="Admin password reset successfully",
        data={"username": "admin", "password": "Admin@iZone2025!"}
    )
