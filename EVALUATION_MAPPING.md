# GRANTLY Evaluation Mapping

The following map aligns the supplied problem statements with implemented prototype areas and practical evaluator checks. Demo records are synthetic and must not be judged or shown as official offers.

| Problem or requirement | Feature and location | How an evaluator can test |
| --- | --- | --- |
| Scholarship information is scattered across multiple websites. | Centralized discovery at `/discover`; official resource directory at `/resources`. | Search the catalogue; then follow the official-resource links to their real provider portals. Note that bundled awards are synthetic. |
| Students struggle to identify relevant scholarships. | Student profile at `/profile`; calculated SmartMatch at `/matches`; category-preference relevance and sorting at `/discover`. | Edit course, level, state, marks or category preferences; return to matches and confirm the score and ranked results change. Category preference affects relevance, not eligibility. |
| Eligibility rules are difficult to understand. | Record-specific criteria at `/scholarships/:scholarshipId`; eligibility modal on details/discovery; explainable SmartMatch. | Check a record; alter a profile field; inspect matched, missing and mismatched conditions and the explanation. |
| Students miss application dates. | Deadline display on scholarship cards/details, dashboard deadline panel and `/notices` Funding Radar. | Open a sample notice and confirm it routes to its linked record; update the tracker stage. All dates are synthetic. |
| Required documents and procedures are confusing. | Per-record sample checklist and steps; persistent `/documents` readiness checklist. | Toggle a document; inspect progress; refresh and confirm status remains. Verify the privacy notice says uploads are not collected. |
| Multiple applications are difficult to track. | `/tracker` with seven stages, notes, date and progress; Saved page can move records to tracker. | Add a sample, change stage/date/note, filter by stage, refresh, then remove and confirm. |
| No unified scholarship journey exists. | Dashboard and protected app navigation join discovery, matches, saved records, tracker, checklist and notices. | Enter the student demo and use dashboard quick links to move through the entire flow. |
| Search and filters must work. | `/discover`. | Search a name/provider, filter course/level/category/state/amount/deadline, sort each way, reset and trigger a no-result state. |
| Data and metrics must be truthful. | Demo badges, demo notices, data caveats and state-derived dashboard values. | Inspect a record’s source section; verify no synthetic item is labeled verified and the linked portal is explicitly described as a general reference. |
| Admin features must be role-gated when practical. | `/admin`, accessible through the separate Admin demo entry only. | Sign in as a student and confirm admin navigation is absent; exit and choose Admin demo, then add/edit/remove a demo record. Confirm local-only/unauthorized limitation is stated. |
| Accessibility and responsive behavior. | Semantic controls, labelled forms, focus outlines, keyboard-operable navigation and mobile layouts. | Use Tab/Enter/Escape on navigation/forms/modal; inspect at desktop, tablet and narrow mobile widths. |
| Architecture and deployment. | Modular `src/`, Express API, Vercel/Render/Docker configuration and route manifest. | Run `pnpm test`, `pnpm check`, `pnpm build`; call `/api/health`; directly load a detail route and check `/manus-routes.json`. |

## Supplied audit panels (reported separately)

**Panel A:** Problem Alignment & Features 0/25; UI/UX & Responsiveness 5.39/20; Functionality & Interactivity 0.45/25; Code Quality & Architecture 0.87/10; Performance & Accessibility 3.26/10; Innovation & Creativity 0/5; Documentation 2.24/5.

**Panel B:** Performance 3.50/7; Accessibility 7/7; Responsive Design 4.50/7; Code Quality 3.50/7; Architecture 0.50/6; Documentation 2.02/6.

These panels are independent and are not combined into a new score. Their values are the prior audit figures supplied in the project brief, not scores awarded to this implementation.
