# GRANTLY Testing Checklist

## Automated checks

- [x] `pnpm test` passes deterministic SmartMatch tests (7 passed, including category-preference relevance and ranking).
- [x] `pnpm check` passes JavaScript syntax checks.
- [x] `pnpm build` succeeds and outputs a production SPA.
- [x] Express `/api/health`, catalogue, resource and notice endpoints return JSON in development; `/api/health` and catalogue also work in the production-mode server.
- [x] `GET /manus-routes.json` returns the static 14-route manifest, not the SPA shell.

## Verified browser and runtime smoke checks

- [x] Public Preview loads from the published-style HTTPS hostname after restricting Vite's allowed hosts to Manus Preview plus localhost.
- [x] The **Explore the student demo** control opens the student workspace; dashboard counts and Recharts visualizations render from the seeded demo state.
- [x] SmartMatch renders profile-based scores, matched criteria and its non-official eligibility caveat.
- [x] Searching for `Design Makers` filters the catalogue to one matching synthetic example.
- [x] Saving that example updates Saved; adding it from Saved updates the tracker and its visible opportunity count.
- [x] Full-page visual captures were reviewed at 1280px desktop, 768px tablet and 375px mobile widths; the README includes representative desktop and mobile captures.
- [x] In the production-mode Express process, direct requests for `/`, `/discover`, `/matches`, and `/scholarships/rise-engineering` serve the SPA; `/api/health`, `/api/scholarships`, and `/manus-routes.json` also return successful responses.

The smoke checks above are a representative sample, not an exhaustive browser acceptance pass. In particular, the save-to-tracker action was checked across routes, but persistence after a hard browser refresh, every filter/sort combination, every detail record, keyboard/modal behavior, and all form validation paths were not independently browser-exercised in this pass.

## Student demo journey

- [ ] Landing CTAs and public navigation work at desktop and mobile widths.
- [x] Demo entry opens the student workspace.
- [ ] Sign-out returns to the public site.
- [ ] Profile validation reports errors; valid profile changes persist and affect SmartMatch.
- [ ] Discovery search, each filter, sorting, reset and empty-result state work.
- [ ] Each sample detail route renders its own dates, amount, criteria, documents, steps and source caveat.
- [ ] Save/unsave, tracker add, eligibility check and official external links work.
- [ ] SmartMatch reports deterministic scores, matched/missing/mismatched criteria and the non-official decision caveat.
- [ ] Saved items, application stage/date/notes, checklist status and read notices persist after refresh.
- [ ] Tracker status filtering and confirmed removal work.
- [ ] Notices route to their related sample record and remain visibly demo-labelled.
- [ ] Resource links point to official destinations; guide text is available in-app.
- [ ] Dashboard figures and charts reflect the current profile, saved items, applications and checklist state.
- [ ] Admin controls are absent from student navigation and visible only in the explicit Admin demo preview; modifications stay local.
- [ ] Keyboard focus is visible; forms have labels; modal can close by Escape and backdrop; reduced-motion setting is respected.

## Responsive review

- [ ] Desktop: 1280px wide.
- [ ] Tablet: 768px wide.
- [ ] Mobile: 375px wide.
- [ ] No horizontal overflow; menus, cards, filters, forms, charts and tracker remain usable.

## Known limitations

- No secure auth, database, live records, cross-device sync, provider submission, email reminders, document uploads or production admin authorization.
- Catalogue details, dates, amounts, eligibility and notices are synthetic demo content.
- User-facing validation must never be interpreted as official eligibility.
