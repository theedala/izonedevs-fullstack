from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from config import settings
from database import engine, create_tables
from routers import auth, users, communities, projects, events, blog, store, gallery, contact, upload, event_registrations, partners, team_members

# Create upload directory if it doesn't exist (must happen before app initialization)
if not os.path.exists(settings.upload_dir):
    os.makedirs(settings.upload_dir)


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
    allow_origins=["*"],  # Allow all origins
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
app.include_router(event_registrations.router, prefix="/api/event-registrations", tags=["Event Registrations"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(store.router, prefix="/api/store", tags=["Store"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["Gallery"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(partners.router, prefix="/api/partners", tags=["Partners"])
app.include_router(team_members.router, prefix="/api/team-members", tags=["Team Members"])


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
project_root = os.path.abspath(os.path.join(backend_dir, ".."))
frontend_dist = os.path.join(backend_dir, "dist")

print(f"[STARTUP] Backend directory: {backend_dir}")
print(f"[STARTUP] Project root: {project_root}")
print(f"[STARTUP] Looking for frontend at: {frontend_dist}")
print(f"[STARTUP] Frontend exists: {os.path.exists(frontend_dist)}")

if os.path.exists(frontend_dist):
    print(f"[STARTUP] Frontend contents: {os.listdir(frontend_dist)}")
    # Mount assets directory
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
        print(f"[STARTUP] Mounted /assets from: {assets_dir}")
        print(f"[STARTUP] Assets contents: {os.listdir(assets_dir)}")
else:
    print(f"[WARNING] Frontend dist not found")
    print(f"[WARNING] Parent directory contents: {os.listdir(project_root)}")
    if os.path.exists(os.path.join(project_root, "frontend")):
        print(f"[WARNING] Frontend folder contents: {os.listdir(os.path.join(project_root, 'frontend'))}")


# SPA catchall - must be LAST, serves index.html for non-API routes
@app.api_route("/{full_path:path}", methods=["GET"], include_in_schema=False)
async def serve_spa(full_path: str):
    """Catchall route - serves React SPA for all non-API/docs paths"""
    # Don't handle API routes, docs, or uploads here`n    # Assets are served by the file serving logic below (file_path check) (they have their own handlers)
    if full_path.startswith(("api/", "docs", "redoc", "openapi.json")):
        # Let FastAPI's normal 404 handling work
        raise HTTPException(status_code=404, detail="Not Found")
    
    # Check if frontend exists
    if not os.path.exists(frontend_dist):
        return {"error": "Frontend not deployed", "path": full_path}
    
    # Try to serve a specific file if it exists
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Otherwise serve index.html for SPA routing
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"error": "Frontend index.html not found", "checked": index_path}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)


