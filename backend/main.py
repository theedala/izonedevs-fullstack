from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from database import engine, create_tables
from routers import auth, users, communities, projects, events, blog, store, gallery, contact, upload, event_registrations, partners, team_members


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    
    # Create upload directory if it doesn't exist
    if not os.path.exists(settings.upload_dir):
        os.makedirs(settings.upload_dir)
    
    yield
    # Shutdown - cleanup if needed


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API for iZonehub Makerspace - Zimbabwe's innovation hub",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(communities.router, prefix="/api/communities", tags=["Communities"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(event_registrations.router, prefix="/api/events", tags=["Event Registrations"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(store.router, prefix="/api/store", tags=["Store"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(partners.router, prefix="/api/partners", tags=["Partners"])
app.include_router(team_members.router, prefix="/api/team-members", tags=["Team Members"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to iZonehub Makerspace API",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)