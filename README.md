# iZonehub Makerspace Platform

A full-stack makerspace platform for communities, projects, events, registrations, blog content, gallery media, team and partner profiles, and a lightweight product catalogue. The application uses a React and TypeScript frontend with a FastAPI and SQLAlchemy backend.

## Current status

The modernization and stabilization work is complete for the current release scope. The frontend has been redesigned, the UI icon system uses Iconsax, the backend has been hardened, uploaded media is resolved through the backend storage layer, and a daily one-way operational export to Google Sheets is configured outside the repository.

The application has been verified locally for the frontend production build, backend health, authentication and role checks, request validation, event-registration rules, media upload and retrieval, public gallery/team/event/product rendering, and Google Sheets export redaction. MinIO is supported by the storage adapter and Compose configuration, but a live MinIO deployment should still be exercised on the target host before production launch.

## Repository structure

| Path | Purpose |
|---|---|
| `backend/` | FastAPI application, SQLAlchemy models, authentication, routers, services, storage adapter, and seed utilities. |
| `frontend/` | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, public pages, admin workspace, and shared UI components. |
| `scripts/daily_sheets_export.py` | Reusable one-way export job for operational Google Sheets synchronization. |
| `BACKEND_AUDIT_REPORT.md` | Prioritized backend security and logic audit, addressed findings, residual risks, and verification record. |
| `docker-compose.yml` | Optional local full-stack environment with backend, frontend, MinIO, and bucket initialization. |
| `backend/.env.example` | Backend configuration reference for local development and deployment. |

## Local development without Docker

The application can be run locally without Docker. Use a Python virtual environment for the backend and Node.js for the frontend.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

The API listens on `http://localhost:8000`. OpenAPI documentation is available at `http://localhost:8000/docs`, and ReDoc is available at `http://localhost:8000/redoc`.

For local SQLite development, the default database URL is relative to the backend working directory. Create the upload directories if local storage is being used:

```bash
mkdir -p uploads/images uploads/avatars uploads/gallery uploads/files
```

Seed data is intended for development only. Production environments must provide an explicit administrator password through the supported environment configuration rather than relying on a default seed password.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally listens on `http://localhost:5173`. The frontend API base should point to the backend API route, for example:

```bash
VITE_API_URL=http://localhost:8000/api
```

The production build is created with:

```bash
npm run build
```

## Optional Docker and MinIO environment

Docker Compose starts the FastAPI backend, React frontend, MinIO object storage, and a bucket-initialization service:

```bash
docker compose up --build
```

The default local endpoints are listed below.

| Service | URL |
|---|---|
| Frontend | `http://localhost:4173` |
| Backend API | `http://localhost:8000` |
| FastAPI documentation | `http://localhost:8000/docs` |
| MinIO API | `http://localhost:9000` |
| MinIO console | `http://localhost:9001` |

Compose uses named volumes for MinIO objects and backend database data. Replace all development credentials before exposing the environment. In production, provide a strong `SECRET_KEY`, set `ENVIRONMENT=production`, keep `DEBUG=false`, configure an explicit CORS allowlist, and use non-default MinIO credentials. The production secret contract is documented in `backend/.env.example` and `DEPLOYMENT.md`.

## Storage and uploaded media

All upload routes use the shared storage adapter in `backend/storage.py`. The adapter supports an S3-compatible object store such as MinIO and a local filesystem fallback for development. The backend owns upload naming, path sanitization, and storage decisions. The frontend uses `frontend/src/utils/media.ts` to resolve relative backend media paths without confusing the API route prefix with the backend origin.

Public gallery, team, event, project, blog, product, and cart views should use the shared media resolver. Missing legacy media receives a safe fallback instead of leaving a broken image element. Real uploaded objects take precedence over fallback imagery.

## Authentication and security

Authentication uses JWT access and refresh tokens with explicit token-purpose claims. Access-token-protected routes reject refresh tokens. Administrative routes require the appropriate role, and unsafe unauthenticated administrator maintenance endpoints have been removed.

Production configuration rejects debugging mode and default or weak secrets. Request schemas enforce bounded credentials and non-negative commerce and event values. Event registrations normalize email addresses and are protected by a database-level per-event uniqueness rule. Email templates escape user-controlled content before HTML interpolation and sanitize dynamic message headers.

Do not commit `.env` files, passwords, access tokens, password hashes, private Google Sheet links, or production object-storage credentials.

## Daily Google Sheets operations export

The repository contains `scripts/daily_sheets_export.py`, which performs a one-way full export from the application database to a structured Google Sheets workbook. The export clears stale rows before writing current data and records each run in an Export Log. The workbook is intended for operational visibility and follow-up tracking; the application database remains the source of truth.

The export includes operational areas such as events, registrations, contact requests, community applications, projects, blog posts, gallery items, products, communities, partners, team members, and redacted user records. Authentication secrets and password material are excluded. The configured test schedule runs daily; replace the test Google account and destination workbook before production use, and keep workbook sharing restricted to authorized administrators.

## Verification

The following checks have passed during the modernization work:

| Check | Result |
|---|---|
| Python source compilation | Passed. |
| Frontend production build | Passed. |
| Backend health endpoint | Passed locally. |
| Invalid event and product payload rejection | Passed with HTTP 422. |
| JWT access/refresh purpose enforcement | Implemented and smoke-tested. |
| Authenticated upload, public retrieval, and cleanup | Passed locally. |
| Gallery, team, event, and product media rendering | Passed locally with fallback verification. |
| Google Sheets export and redaction | Passed manually; daily schedule configured. |
| Git whitespace and working-tree checks | Passed; repository is clean after the latest commit. |

The Vite build still reports a non-blocking bundle-size warning. Route-level lazy loading is a suitable future performance improvement. The complete backend findings and residual deployment risks are recorded in `BACKEND_AUDIT_REPORT.md`.

## Recommended next improvements

The next engineering work should focus on quality rather than another redesign. The highest-value items are route-level code splitting, automated regression tests for authentication/uploads/registrations, refactoring large admin components into shared tables and forms, completing real team/partner/project content, and testing MinIO persistence and restore behavior on the actual deployment host.

## Documentation

| Document | Scope |
|---|---|
| `DEPLOYMENT.md` | Deployment checklist, environment contract, storage, backups, and operational verification. |
| `BACKEND_AUDIT_REPORT.md` | Backend audit findings, fixes, residual risks, and verification details. |
| `backend/.env.example` | Backend environment variable reference. |
| `frontend/README.md` | Frontend-specific setup and build instructions. |

## License

MIT
