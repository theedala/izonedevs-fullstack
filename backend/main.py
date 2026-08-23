from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import logging
import os
from pathlib import Path

from config import settings
from database import engine, create_tables
from upload import router as upload_router
from routers import auth, users, communities, projects, events, blog, store, gallery, contact, event_registrations, partners, team_members, admin_dashboard

logger = logging.getLogger(__name__)

# Create upload directory if it doesn't exist (must happen before app initialization)
os.makedirs(settings.upload_dir, exist_ok=True)



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    
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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(communities.router, prefix="/api/communities", tags=["Communities"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(event_registrations.router, prefix="/api/event-registrations", tags=["Event Registrations"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(store.router, prefix="/api/store", tags=["Store"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(upload_router, prefix="/api/upload", tags=["Upload"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(partners.router, prefix="/api/partners", tags=["Partners"])
app.include_router(team_members.router, prefix="/api/team-members", tags=["Team Members"])
app.include_router(admin_dashboard.router, prefix="/api/admin", tags=["Admin"])


# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Welcome to iZonehub Makerspace API",
        "version": settings.app_version,
        "docs": "/docs"
    }


# Serve frontend application static files
# Determine the correct path to frontend dist
backend_dir = os.path.dirname(__file__)
frontend_dist = os.path.join(backend_dir, "dist")

frontend_dist_path = Path(frontend_dist).resolve()

if frontend_dist_path.exists():
    assets_dir = frontend_dist_path / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
    logger.info("Serving frontend from %s", frontend_dist_path)
else:
    logger.warning("Frontend dist not found at %s", frontend_dist_path)


# SPA catchall - must be LAST, serves index.html for non-API routes
@app.api_route("/{full_path:path}", methods=["GET"], include_in_schema=False)
async def serve_spa(full_path: str):
    """Catchall route - serves React SPA for all non-API/docs paths"""
    # Don't handle API routes, docs, or uploads here
    if full_path.startswith(("api/", "docs", "redoc", "openapi.json", "uploads/")):
        # Let FastAPI's normal 404 handling work
        raise HTTPException(status_code=404, detail="Not Found")
    
    # Check if frontend exists
    if not os.path.exists(frontend_dist):
        return {"error": "Frontend not deployed", "path": full_path}
    
    # Resolve the requested path and reject traversal outside the built SPA.
    file_path = (frontend_dist_path / full_path).resolve()
    if frontend_dist_path not in file_path.parents and file_path != frontend_dist_path:
        raise HTTPException(status_code=404, detail="Not Found")
    if file_path.is_file():
        return FileResponse(str(file_path))
    
    # Otherwise serve index.html for SPA routing
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"error": "Frontend index.html not found", "checked": index_path}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)


