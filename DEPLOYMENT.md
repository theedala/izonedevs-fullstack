# iZonehub Deployment Guide

This document describes the deployment contract for the iZonehub FastAPI and React application. The recommended process is to validate the application locally, deploy to a staging environment, run the verification checklist, and only then switch production traffic.

## Security notice

The previous version of this document contained a plaintext SMTP app password in the repository. It has been removed. If that credential was ever active, revoke it and issue a new credential before sending production email. Never commit SMTP passwords, API keys, JWT secrets, database passwords, or private Google Sheet links.

## Required production configuration

Set these values through the hosting provider’s secret and environment configuration. Do not commit them to Git.

| Variable | Requirement |
|---|---|
| `ENVIRONMENT` | Set to `production`. |
| `SECRET_KEY` | A random, unique secret of at least 32 characters; never use the development default. |
| `DEBUG` | Set to `false`. |
| `DATABASE_URL` | A persistent production database URL. SQLite is acceptable for a small single-instance deployment only when its volume is durable and backed up. |
| `ALLOWED_ORIGINS` | A comma-separated allowlist containing only the real frontend origins. |
| `S3_ENDPOINT_URL` | The internal or private MinIO/S3 endpoint used by the backend. |
| `S3_PUBLIC_URL` | The public media origin reachable by browsers. |
| `S3_BUCKET` | The production bucket name. |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | Non-default object-storage credentials. |
| `S3_REGION` / `S3_SECURE` | Match the object-storage deployment and HTTPS configuration. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Optional, but required if production email notifications are enabled. Use an SMTP app password or provider credential rather than a personal account password. |
| `VITE_API_URL` | The frontend-visible backend API base, including `/api`, for example `https://api.example.com/api`. |

## Docker Compose deployment

From the repository root, create a private environment file or inject variables through the hosting platform, then start the stack:

```bash
docker compose up --build -d
```

Compose starts MinIO, initializes the configured bucket, starts the backend, and then starts the frontend. The default local ports are `4173` for the frontend, `8000` for the API, `9000` for the MinIO API, and `9001` for the MinIO console.

Before using the stack for real data, replace the default MinIO credentials and confirm that both named volumes are backed up. Do not expose the MinIO console or administrative API publicly unless access is protected by a separate network and authentication layer.

## Media storage requirements

The backend storage adapter supports MinIO and other S3-compatible storage. Production media should use a durable bucket with a documented retention and backup policy. Confirm that the public media URL serves an uploaded test image from the browser, not only from inside the backend container.

The release test should upload one image through an authenticated admin route, confirm the returned object URL, load it from the public gallery or team view, delete it, and confirm that the object and database record are removed as expected. Repeat this after restarting the backend to verify persistence.

## Database and backup requirements

The application database remains the source of truth. Backups should be created independently of the Google Sheets operational export. A minimum deployment policy should include a daily database backup, retention of multiple backup generations, and a periodically tested restore into an isolated environment.

The Google Sheets export is a one-way operational mirror. It is useful for follow-up, reporting, and human-readable tracking, but it must not be treated as the only disaster-recovery copy.

## Google Sheets operations export

The reusable export job is located at `scripts/daily_sheets_export.py`. The configured schedule runs the full export once per day. Before changing the account or workbook, create the new destination, update the scheduler’s connector and spreadsheet identifier, run one manual export, and verify the Export Log.

Keep the workbook restricted to authorized administrators. The export deliberately excludes passwords, password hashes, access tokens, refresh tokens, and other authentication secrets. Review the exported columns before adding any new sensitive fields to the job.

## Release verification checklist

| Check | Expected result |
|---|---|
| Frontend production build | `npm run build` completes successfully. |
| Backend startup | The API starts without migration or configuration errors. |
| Health endpoint | The health endpoint returns a successful response. |
| Authentication | Access tokens work, refresh tokens are rejected on access-token routes, and admin routes enforce roles. |
| Registration | Invalid payloads return validation errors, ended events reject registration, and duplicate emails cannot register twice for one event. |
| Upload | An authenticated upload stores an object and returns a browser-reachable URL. |
| Public rendering | Gallery, team, event, project, blog, product, and cart media render or fall back safely. |
| Email | SMTP notifications work when configured, and failures do not expose credentials or unsafe HTML. |
| Sheets export | The export completes without secrets, clears stale rows, and writes an Export Log entry. |
| Restore | A database and object-storage backup can be restored into an isolated environment. |
| HTTPS and CORS | Only the intended frontend origin is allowed, and all public traffic uses HTTPS. |

## Rollback

Keep the previous application image or release available until the new release has passed the post-deployment checks. If a release must be rolled back, preserve the database and object-storage state, record the failed release and error symptoms, and avoid destructive migrations without a tested reverse or restore procedure.

## Known non-blocking improvements

The frontend production bundle still produces a Vite chunk-size warning. Route-level lazy loading is recommended. The admin workspace contains several large components that should be split gradually. These are quality and performance improvements, not prerequisites for the current local release scope.
