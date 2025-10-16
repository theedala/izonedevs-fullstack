from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./izonedevs.db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production-make-it-very-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:8080", "http://localhost:4000", "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:8080", "http://127.0.0.1:4000", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    
    # File uploads
    max_file_size: int = 10485760  # 10MB
    upload_dir: str = "uploads"
    
    # Email (Gmail SMTP)
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = "izonemakers@gmail.com"
    smtp_password: str = "kmub uxpm bhsw qnkd"
    
    # App settings
    debug: bool = True
    app_name: str = "iZonehub Makerspace API"
    app_version: str = "1.0.0"

    class Config:
        env_file = ".env"


settings = Settings()