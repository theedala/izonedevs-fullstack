from __future__ import annotations

import mimetypes
import os
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import boto3
from botocore.client import Config as BotoConfig
from botocore.exceptions import BotoCoreError, ClientError

from config import settings


class ObjectStorage:
    """S3-compatible object storage with a local filesystem fallback."""

    def __init__(self) -> None:
        self.endpoint_url = settings.s3_endpoint_url.rstrip('/') if settings.s3_endpoint_url else None
        self.bucket = settings.s3_bucket
        self.public_url = settings.s3_public_url.rstrip('/') if settings.s3_public_url else None
        self._client = None
        if self.endpoint_url and settings.s3_access_key and settings.s3_secret_key:
            self._client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.s3_access_key,
                aws_secret_access_key=settings.s3_secret_key,
                region_name=settings.s3_region,
                use_ssl=settings.s3_secure,
                config=BotoConfig(signature_version='s3v4'),
            )

    @property
    def enabled(self) -> bool:
        return self._client is not None

    def ensure_bucket(self) -> None:
        if not self.enabled:
            return
        try:
            self._client.head_bucket(Bucket=self.bucket)
        except (ClientError, BotoCoreError):
            self._client.create_bucket(Bucket=self.bucket)

    def put_bytes(self, content: bytes, object_name: str, content_type: Optional[str] = None) -> str:
        object_name = object_name.lstrip('/')
        content_type = content_type or mimetypes.guess_type(object_name)[0] or 'application/octet-stream'
        if self.enabled:
            self.ensure_bucket()
            self._client.put_object(Bucket=self.bucket, Key=object_name, Body=content, ContentType=content_type)
            return self.url_for(object_name)

        destination = Path(settings.upload_dir) / object_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(content)
        return f"/uploads/{object_name}"

    def delete_url(self, stored_url: Optional[str]) -> None:
        if not stored_url:
            return
        if self.enabled:
            key = self.key_from_url(stored_url)
            if key:
                try:
                    self._client.delete_object(Bucket=self.bucket, Key=key)
                except (ClientError, BotoCoreError):
                    pass
            return
        if stored_url.startswith('/uploads/'):
            local_path = Path(settings.upload_dir) / stored_url.removeprefix('/uploads/')
            if local_path.exists():
                local_path.unlink()

    def url_for(self, object_name: str) -> str:
        object_name = object_name.lstrip('/')
        if self.public_url:
            return f"{self.public_url}/{self.bucket}/{object_name}"
        return f"{self.endpoint_url}/{self.bucket}/{object_name}"

    def key_from_url(self, stored_url: str) -> Optional[str]:
        if stored_url.startswith('/uploads/'):
            return stored_url.removeprefix('/uploads/')
        parsed = urlparse(stored_url)
        path = parsed.path.lstrip('/')
        prefix = f"{self.bucket}/"
        return path.removeprefix(prefix) if path.startswith(prefix) else path or None


object_storage = ObjectStorage()
