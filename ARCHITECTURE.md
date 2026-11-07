# GRANTLY Architecture

## System shape

GRANTLY is a Vite/React SPA backed by a small Express REST API. During development the preview site listens on port 3000 and proxies `/api` to Express on port 3001. In production, the Express process serves the built `dist/` directory and the API on `PORT` (default 3000). This supports a single-origin Render service. For Vercel static hosting, deploy the API separately and set `VITE_API_BASE_URL` at build time.

## Frontend responsibilities

- `src/main.jsx` mounts React and BrowserRouter.
- `src/App.jsx` declares public, dynamic, student-protected and admin-demo routes.
- `src/components/` owns reusable shells, navigation, cards, notices and eligibility dialog.
- `src/pages/` contains one page module per user journey.
- `src/data/` provides fallback synthetic catalogue data and separate official resources.
- `src/services/api.js` requests same-origin REST endpoints and falls back to the bundled catalogue if the API is unavailable.
- `src/context/AppContext.jsx` persists demo profile, saved records, tracker entries, checklist status and read-notice state in localStorage.
- `src/context/CatalogueContext.jsx` fetches catalogue data and overlays local browser-only admin edits.
- `src/utils/smartMatch.js` contains deterministic weighted matching and ranking independent of presentation.
- `src/utils/validation.js` defines Zod form schemas.

## API

`server/index.js` exposes `GET /api/health`, `GET /api/scholarships`, `GET /api/scholarships/:id`, `GET /api/notices` and `GET /api/resources`. API responses contain no personal student data. CORS denies unknown origins when an Origin header is present; development allows local Vite, while production cross-origin deployment requires exact configured `CORS_ORIGIN` values.

## Data and trust model

All demo scholarship records are synthetic and use an `isDemo` marker, sample-source explanation and no verification date. Official portal links are listed separately as resources. The match engine only evaluates known criteria; absent student fields are marked missing. It never conveys official eligibility. Browser storage is convenience persistence, not secure storage, identity management or a database.

## Deployment files

- `vercel.json`: static build output and SPA rewrite.
- `render.yaml`: Node service, install/build/start commands and `/api/health` check.
- `Dockerfile`: multi-stage container build with static Express serving.
- `.env.example`: non-secret API, port and CORS configuration hints.
- `public/manus-routes.json`: Preview page route manifest.

## Next production steps

Add a real auth provider and server sessions, data ownership/schema and migration plan, validated and versioned scholarship ingestion, provider-verification process, secure document storage only if required, server-side role checks, rate limits and audit logs. Replace the synthetic catalogue only with reviewed records and verifiable provider URLs. Reassess privacy, accessibility and security before handling real student data.
