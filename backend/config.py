import json
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database - MySQL in production, SQLite locally
    database_url: str = "sqlite:///./izonedevs.db"

    # Runtime
    environment: str = "development"
    debug: bool = False

    # Security
    secret_key: str = "local-development-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # CORS
    allowed_origins: List[str] = [
        "http://localhost:4173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://127.0.0.1:5173",
        "https://izonedevs.co.zw",
        "https://www.izonedevs.co.zw",
        "https://coral-app-ycosl.ondigitalocean.app",
    ]

    # File uploads
    max_file_size: int = 10485760  # 10MB
    upload_dir: str = "uploads"

    # S3-compatible object storage (MinIO locally, S3-compatible provider in production)
    s3_endpoint_url: str = ""
    s3_public_url: str = ""
    s3_bucket: str = "izonedevs"
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_region: str = "us-east-1"
    s3_secure: bool = False

    # Email (optional; configure through environment variables)
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""

    # App settings
    app_name: str = "iZonehub Makerspace API"
    app_version: str = "1.0.0"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value):
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("["):
                return json.loads(value)
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    def model_post_init(self, __context) -> None:
        if self.environment.lower() in {"production", "prod"}:
            secret = (self.secret_key or "").strip()
            if (
                len(secret) < 32
                or secret == "local-development-secret-change-me"
                or secret.lower() in {"changeme", "change-me", "secret", "password"}
            ):
                raise ValueError("SECRET_KEY must be a strong, non-default value of at least 32 characters in production")
            if self.debug:
                raise ValueError("DEBUG must be false in production")


settings = Settings()
