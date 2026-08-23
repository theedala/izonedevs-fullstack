# iZonehub Frontend

The iZonehub frontend is a React 18 and TypeScript application built with Vite, Tailwind CSS, Framer Motion, and Iconsax. It contains the public makerspace experience, event and community forms, catalogue and cart views, media rendering, and the protected admin workspace.

## Local setup

From this directory:

```bash
npm install
cp .env.example .env
npm run dev
```

The development server normally runs at `http://localhost:5173`. The backend API should be running separately at `http://localhost:8000`.

Set the API base in `.env` to include the `/api` route:

```bash
VITE_API_URL=http://localhost:8000/api
```

For the Docker Compose frontend, the expected default is `http://localhost:8000/api` while the frontend is served at `http://localhost:4173`.

## Production build

Create and preview a production build with:

```bash
npm run build
npm run preview
```

The build must complete without TypeScript or bundling errors before deployment. Vite currently reports a non-blocking chunk-size warning; route-level lazy loading is the recommended next performance improvement.

## Frontend architecture

| Directory | Responsibility |
|---|---|
| `src/pages/` | Route-level public, admin, authentication, catalogue, event, blog, project, and gallery screens. |
| `src/components/` | Reusable layout, form, card, admin, gallery, store, event, and community components. |
| `src/services/` | Typed API service modules and the shared authenticated API client. |
| `src/context/` | Application state such as authentication and cart state. |
| `src/utils/media.ts` | Backend-origin media URL resolution for relative upload paths and external/data URLs. |
| `src/components/ui/icons.tsx` | Iconsax compatibility adapter used by the application UI. |

Page-level forms should use the shared API client rather than constructing ad-hoc `fetch()` requests. Uploaded media should use `getMediaUrl` from `src/utils/media.ts`; this ensures that `/uploads/...` paths resolve through the backend origin in local, Docker, and deployed environments.

## UI conventions

Use the shared Iconsax adapter for interface icons. Decorative SVG illustrations may remain where they are part of a visual composition rather than an interface icon. New buttons, cards, form fields, loading states, error states, empty states, and dialogs should reuse existing shared components or introduce a reusable primitive instead of duplicating page-specific markup.

All externally supplied images should have useful alternative text, a safe `onError` fallback where appropriate, and a layout that remains stable while the image loads. The gallery, team, event, product, and cart views already use backend-aware media resolution and safe fallbacks.

## Public and admin behavior

The public routes provide information about communities, projects, events, blog content, gallery media, team information, and the product catalogue. The admin workspace is protected by backend authentication and role checks. Do not place administrator credentials, access tokens, refresh tokens, or private operational links in frontend source or environment files committed to Git.

## Verification checklist

| Check | Expected result |
|---|---|
| `npm run build` | Production bundle completes successfully. |
| Public navigation | Home, communities, projects, events, blog, gallery, store, about, and contact routes load. |
| Media rendering | Relative backend upload URLs display correctly or fall back safely. |
| Event registration | Validation errors are visible and successful submissions show confirmation. |
| Community application | Failed submissions show an error instead of a false success state. |
| Cart | Product images, quantity controls, totals, and WhatsApp checkout link work. |
| Admin route | Unauthenticated users cannot access protected admin operations. |
| Responsive layout | Test at approximately 375 px, 768 px, and 1440 px widths. |
| Accessibility | Images have alt text, interactive elements are keyboard reachable, and dialogs expose useful labels. |

## Related documentation

The root `README.md` covers the complete full-stack setup. `DEPLOYMENT.md` covers production configuration, storage, backups, Google Sheets operations export, and release verification. `BACKEND_AUDIT_REPORT.md` records the backend security and logic audit.
