# GRANTLY Feature Inventory

## Implemented in the prototype

| Module | Implemented behavior |
| --- | --- |
| Landing and navigation | Responsive marketing site, product explanation, featured synthetic opportunities, FAQ and working page/source links. |
| Demo identity and profile | Signup, sign-in, sign-out, sample student/admin-demo entry and profile editing. Password is not persisted; demo flow is not production authentication. |
| Discovery | Name/provider search; course, level, category, state, award minimum and deadline-window filters; reset; amount/deadline/profile-relevance sorting; no-results state; clearly synthetic government-style and private-style provider labels. |
| Scholarship details | Per-record summary, criteria, dates, documents, steps and general reference link with explicit synthetic/unverified caveat. Save, eligibility-check and tracker actions work. |
| SmartMatch | Weighted deterministic eligibility-fit comparison, with a separate category-preference contribution to relevance when interests are selected; includes Potential Match / Needs Verification / Unlikely Match, matched/missing/mismatched conditions and explanations. Category preference never creates an eligibility mismatch. |
| Saved items | Persistent save/remove, search, sorting and record details. |
| Application tracker | Seven requested stages, application date, notes, progress, status filter, upcoming sample dates and confirmed removal. |
| Document readiness | Ready/pending checklist, grouped progress and no-upload privacy notice. |
| Funding Radar | Synthetic spotlight/deadline notices, unread/read filters, persisted read state and links to related records. |
| News and resources | Official portal links checked during implementation plus preparation guides. |
| Dashboard | State-derived counts, Recharts match ranking and application status distribution, readiness progress and quick links. |
| Admin demo | Browser-only add/edit/remove synthetic records and create demo notices; visible only after choosing the admin-demo entry, not production authorization. |
| REST API | Express JSON endpoints for the catalogue, a single record, notices, resources and health. Production mode serves the built SPA with direct-route fallback. |

## Not configured or not claimed

- Secure user authentication, password verification or production roles.
- Supabase/PostgreSQL storage or cross-device sync.
- Live scholarship feeds, official record verification, live announcements or active provider deadlines.
- Award-specific application URLs for fictional sample awards. Each detail view instead exposes a real general official reference and clearly says that it does not verify or apply to the synthetic record.
- Email, SMS, push notifications or background reminder delivery.
- Provider application submission, identity-document uploads or collection of sensitive documents.
- Secure server-side admin CRUD, audit logs or multi-user management.
- Gemini API integration; matching is rule-based and works without an AI API.
