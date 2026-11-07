# GRANTLY — Implementation Plan

## Product and implementation approach

Build a complete student-facing scholarship journey as a responsive React/Vite application with a small Express REST API. Keep scholarship examples explicitly labelled as illustrative demo data; do not imply an example is a verified active award. The API serves the seeded catalogue and health status, while student profile, saved opportunities, applications, notices/read state, and document readiness persist in browser storage for a usable no-credentials demo. Demo identity is clearly labelled and never persists a password. No external auth provider or database is available/configured, so production-grade identity, cross-device synchronization, and secure role enforcement are not claimed.

Use React Router for public and app routes; reusable components and separated data/services/domain utilities; Tailwind CSS v4 for utility styling with a small brand token layer; Lucide React for icons; Recharts for real state-derived analytics. Use JavaScript ES modules as requested, Zod for relevant input validation, and CSS transitions/reduced-motion support rather than adding animation weight unnecessarily. Keep API base paths relative and the server listening on the configured port. Include an `.env.example`, health endpoint, route manifest, Vercel SPA fallback, and Render-ready server configuration where practical.

## Core journeys and pages

- Public landing page: brand/navigation, concise scholarship-value proposition, problem/solution, feature tour, featured examples, clear demo metrics, workflow, FAQs, functional calls to action and real external resource links.
- Demo sign-up/sign-in/logout and student profile: editable academic/background/preferences fields; optional income; demo-only identity behavior and explicit privacy boundary.
- Student workspace: personalized dashboard; Discover; scholarship details; SmartMatch; interactive Eligibility Checker; Saved; Application Tracker; Document Readiness; Funding Radar/Notice Board; News & Resources; Profile. Include an admin-ready, explicitly demo-only management area gated from ordinary student-role navigation; do not represent demo gating as production authorization.
- Discovery supports free-text search, requested filters, reset, deadline/amount/relevance sorting, progressive results, and a useful empty state. Scholarship records own their full details and SmartMatch criteria.
- Application workflow preserves the seven requested stages, notes/dates, deadline awareness and confirmation on removal. Saved items and checklist state persist on refresh.
- SmartMatch is deterministic and explainable: compare only known profile and scholarship criteria, produce matched/missing/mismatched reasons and a score from those comparisons, and add selected category interests as a separate relevance-only signal that never changes eligibility status. Classify Potential Match / Needs Verification / Unlikely Match and state that provider confirmation is final. The eligibility check reuses the same domain logic and supports correcting the profile.
- Notices, funding radar, reminders and resources are demo-labelled; each interactive card routes to its actual related record/resource. No fake announcement is presented as verified/live.

## Architecture and project structure

- `src/main.jsx`, `src/App.jsx`: Vite entry and route declarations.
- `src/components/`: public/app navigation, cards, forms, modals, accessible feedback, match explanations, chart and checklist components.
- `src/pages/`: landing, auth/demo entry, dashboard, discovery, scholarship detail, saved, tracker, documents, notices/resources, profile and admin-demo views.
- `src/data/`: clearly identified demo scholarship and notice fixtures with dates, criteria, document requirements and source/disclaimer metadata.
- `src/services/`: same-origin REST API client and catalogue requests.
- `src/context/` and `src/utils/`: React state providers and browser-storage helpers for profile, saved items, applications, document readiness and notice state; SmartMatch/eligibility scoring, form validation, formatters and deadline helpers.
- `server/`: Express app, REST routes, catalogue service and `/api/health`.
- `public/manus-routes.json`: complete route manifest; deployment config for SPA routing.
- Root documentation: `README.md`, `PROJECT_OVERVIEW.md`, `FEATURES.md`, `ARCHITECTURE.md`, `TESTING_CHECKLIST.md`, `.env.example`, plus this plan and the required outcome-based `TODO.md`.

## Design direction

**Movement:** editorial education technology with restrained Swiss-influenced information design and a warm student-support tone.

**Core principles:** opportunity before administration; explainable recommendations; calm, readable density; visible trust boundaries.

**Color philosophy:** golden yellow `#F5B82E` is an ownable signal for action and progress; dark navy `#252641` anchors trust and legibility; off-white `#F8F8F7`, white and muted gray create a quiet canvas. Use accessible contrast and reserve yellow for purposeful emphasis.

**Layout paradigm:** public pages use an editorial, left-aligned narrative and asymmetric content bands; signed-in pages use a compact persistent navigation rail paired with a broad content canvas, not a generic full-width KPI grid. On mobile, navigation becomes a labelled, keyboard-operable menu and cards stack naturally.

**Signature elements:** a simple “open-book / rising-sun” GRANTLY mark; scholarship cards with a thin golden eligibility accent and explicit demo/source badges; deadline and progress indicators rendered as compact, readable timelines.

**Interaction philosophy:** controls show their effect immediately, changes persist where stated, and recommendations expose their reasoning. Modals and forms support keyboard and focus handling; status changes use clear confirmation/feedback rather than decorative motion.

**Animation:** brief color/opacity/position transitions only for navigation, card feedback and disclosure; respect `prefers-reduced-motion`; no animation that delays core actions.

**Typography:** Poppins for headings and Inter for body text, with a clear hierarchy and line lengths suited to scanning. Load fonts in a production-safe way and retain sensible system fallbacks.

**Brand essence:** a practical scholarship companion for students, different because it joins discovery, transparent matching, preparation and tracking; supportive, trustworthy, focused.

**Brand voice:** direct and reassuring, never promising awards. Example lines: “Find funding that fits your next step.” “A strong match is a starting point—confirm details with the provider.”

**Wordmark and signature color:** custom book-and-sun line mark paired with a carefully spaced GRANTLY wordmark; golden yellow `#F5B82E` is the signature brand color.

## Assumptions and constraints

- There is no official hackathon statement/rubric or audit screenshot beyond the pasted brief; map and implement the brief's requirements and preserve the two audit panels as separate context in documentation.
- No Supabase/PostgreSQL credentials were supplied. The initialized project has a managed Express server but no managed database; do not collect sensitive identity documents or store passwords in browser storage.
- Demo scholarship fixtures can be synthetic and realistic only if they are unmistakably labelled as unverified demonstrations. External links must lead to real destinations; do not claim a generic portal link verifies an individual fixture.
- Deployment readiness is part of delivery, but publishing is not implied by this request.

## Build and delivery workflow

After approval: create the outcome-based `TODO.md`; register JavaScript/HTML/CSS diagnostics; add the app/API and route manifest; implement shared data/domain logic before wiring page interactions; add documentation and deployment files; install pinned dependencies with an explicit reviewed lifecycle-script policy; run diagnostics, tests and production build; check route manifest and API health; conduct a read-only requirements/architecture review and fix confirmed issues. Deliver the working project, setup/deployment instructions, limitations, and a truthful feature/testing report. Do not publish unless separately requested.
