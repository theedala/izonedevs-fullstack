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


# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Welcome to iZonehub Makerspace API",
        "version": settings.app_version,
        "docs": "/docs"
    }

# Serve frontend static files (must be last to not override API routes)
# Check if frontend dist directory exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
print(f"Looking for frontend at: {frontend_dist}")
print(f"Frontend exists: {os.path.exists(frontend_dist)}")

if os.path.exists(frontend_dist):
    print(f"Serving frontend from: {frontend_dist}")
    # Mount static assets
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
        print(f"Mounted assets from: {assets_dir}")
    
    # Serve index.html for all non-API routes (SPA catchall)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # If requesting a file that exists, serve it
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise serve index.html (SPA routing)
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not found", "path": frontend_dist}
else:
    print(f"WARNING: Frontend dist not found at {frontend_dist}")
    # Return info page at root if frontend not found
    @app.get("/")
    async def root_fallback():
        return {
            "message": "iZonehub Makerspace API",
            "status": "Frontend not deployed",
            "frontend_path_checked": frontend_dist,
            "api_docs": "/docs"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)