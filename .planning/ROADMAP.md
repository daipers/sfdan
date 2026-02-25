# Roadmap: Procedural Integrity Score Dashboard

## Phases

- [x] **Phase 1: Foundation & Data Ingestion** - Set up Next.js project, connect to USASpending.gov API, implement caching layer
- [x] **Phase 2: Scoring Engine** - Build procedural compliance scoring with defensible methodology and regulatory citations
- [x] **Phase 3: Dashboard & Search** - Create searchable dashboard with filters, data table, and summary metrics
- [x] **Phase 4: Details & Lead Gen** - Build project detail pages and email-gated lead generation
- [x] **Phase 5: Visualization & Self-Assessment** - Add agency comparison charts, self-assessment tool, and data export functionality
- [x] **Phase 6: Polish & Quality** - Add tests, error pages, and improve SEO metadata
- [ ] **Phase 7: Content & Newsletter** - Content generation system for publishing data-driven findings
- [x] **Phase 12: Runtime Data Errors** - Resolve static export data errors and integration guardrails (completed 2026-02-25)

---

## Phase Details

### Phase 1: Foundation & Data Ingestion
**Goal:** Users can access IIJA project data from USASpending.gov with reliable data currency  
**Depends on:** Nothing (first phase)  
**Requirements:** DATA-01, DATA-02, DATA-03, DATA-04, DATA-05  

**Success Criteria** (what must be TRUE):
1. Dashboard displays projects fetched from USASpending.gov API v2
2. Data refresh indicator shows "Data as of [date]" to users
3. API rate limiting is handled gracefully (users don't see errors)
4. Cached data is used when API is unavailable or rate-limited
5. IIJA-specific awards are filtered correctly (by funding agency, assistance type)

**Plans:**
- [x] 01-foundation-PLAN.md — Set up Next.js, USASpending.gov API, caching

---

### Phase 2: Scoring Engine
**Goal:** Users can see defensible procedural compliance scores for each project  
**Depends on:** Phase 1  
**Requirements:** SCR-01, SCR-02, SCR-03, SCR-04, SCR-05  

**Success Criteria** (what must be TRUE):
1. Every project displays a procedural compliance score (0-100)
2. Score breakdown shows environmental review timing, competitive bidding, modification authorization components
3. Methodology page documents scoring rules with regulatory citations (2 CFR 200, Build America Buy America, Davis-Bacon)
4. Scores calculate automatically when data syncs
5. Users understand what the score means through tooltips and explanations

**Plans:**
- [x] 02-scoring-01-PLAN.md — Scoring engine with rule definitions and methodology

---

### Phase 3: Dashboard & Search
**Goal:** Users can find and explore IIJA projects with filters and sortable data table  
**Depends on:** Phase 2  
**Requirements:** FILT-01, FILT-02, FILT-03, FILT-04, FILT-05, TABL-01, TABL-02, TABL-03, TABL-04, TABL-05  

**Success Criteria** (what must be TRUE):
1. Users can search projects by keyword (name, description)
2. Users can filter by state, federal agency, and project category
3. Multiple filters combine with AND logic
4. Data table supports server-side pagination for >10K rows
5. Table columns are sortable (amount, date, score)
6. Summary metrics show total spending and project counts
7. Dashboard works on mobile devices

**Plans:**
- [x] 03-01-PLAN.md — Core infrastructure (dependencies, URL state, API layer)
- [x] 03-02-PLAN.md — Data table and filter components
- [x] 03-03-PLAN.md — Summary metrics and mobile responsiveness

---

### Phase 4: Details & Lead Gen
**Goal:** Users can view detailed project information and convert to leads via gated content  
**Depends on:** Phase 3  
**Requirements:** PROJ-01, PROJ-02, PROJ-03, PROJ-04, LEAD-01, LEAD-02, LEAD-03, LEAD-04, DOC-01, DOC-02, DOC-03  

**Success Criteria** (what must be TRUE):
1. Each project has a dedicated detail page with full score breakdown
2. Detail pages show project timeline and key dates
3. Links from detail pages to source data on USASpending.gov
4. Users can enter email to unlock detailed PDF reports
5. Magic link authentication works via Supabase Auth
6. Leads store organization/role for follow-up
7. Public methodology explainer page is accessible
8. FAQ section addresses common scoring questions
9. Data sources page explains update frequency

**Plans:**
- [x] 04-01-PLAN.md — Project detail pages with score breakdown and timeline
- [x] 04-02-PLAN.md — Lead generation with Supabase Auth magic links
- [x] 04-03-PLAN.md — Documentation pages (methodology, FAQ, data sources)

---

### Phase 5: Visualization & Self-Assessment
**Goal:** Add agency comparison charts, self-assessment tool, and data export functionality  
**Depends on:** Phase 4  

**Success Criteria** (what must be TRUE):
- Users can view agency comparison charts
- Users can assess their own projects for compliance
- Users can export data to CSV/Excel

**Plans:**
- [x] 05-01-PLAN.md — Agency comparison charts
- [x] 05-02-PLAN.md — Self-assessment tool
- [x] 05-03-PLAN.md — Data export functionality

---

### Phase 6: Polish & Quality
**Goal:** Add tests, error pages, and improve SEO metadata  
**Depends on:** Phase 5  

**Success Criteria** (what must be TRUE):
- Key business logic has unit tests
- Custom 404 page exists
- SEO metadata includes Open Graph tags
- Basic E2E smoke tests pass

**Plans:**
- [x] 06-01-PLAN.md — Tests, error pages, SEO polish

---

### Phase 7: Content & Newsletter
**Goal:** Content generation system for publishing data-driven findings  
**Depends on:** Phase 6  

**Success Criteria** (what must be TRUE):
- Newsletter signup form exists
- Automated insights can be generated from project data
- Content pages can be published with data-driven findings

**Plans:**
- [ ] 07-01-PLAN.md — Newsletter signup and email management
- [ ] 07-02-PLAN.md — Automated insights generation
- [ ] 07-03-PLAN.md — Content publishing system

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Ingestion | 1/1 | Completed | 2026-02-20 |
| 2. Scoring Engine | 1/1 | Completed | 2026-02-20 |
| 3. Dashboard & Search | 3/3 | Completed | 2026-02-21 |
| 4. Details & Lead Gen | 3/3 | Completed | 2026-02-21 |
| 5. Visualization & Self-Assessment | 3/3 | Completed | 2026-02-21 |
| 6. Polish & Quality | 1/1 | Completed | 2026-02-21 |
| 7. Content & Newsletter | 3/3 | Completed | 2026-02-22 |
| 8. Functionality Expansion | 3/3 | Completed | 2026-02-22 |
| 9. Stabilization & Deployment Hardening | 3/3 | Completed | 2026-02-22 |
| 10. Fix Netlify 500 Error | 1/1 | Completed | 2026-02-22 |
| 11. GitHub Pages Migration | 3/3 | Completed | 2026-02-24 |
| 12. Runtime Data Errors | 1/1 | Complete   | 2026-02-25 |

---

## Dependencies

```
Phase 1 ─────> Phase 2 ─────> Phase 3 ─────> Phase 4 ─────> Phase 5 ─────> Phase 6 ─────> Phase 7
   (data)       (scoring)       (UI)          (gated)       (viz)          (polish)       (content)
```

---

## Notes

- **Depth:** quick (3-5 phases) - 6 phases planned
- **Timeline:** 6-8 weeks
- **Audience:** Government watchdog journalists, municipal finance officers, inspector general community
- **Core value:** Defensible procedural compliance scoring

### Phase 8: 8 functionality expansion, we are going to make sure it works exactly like we want it to. We want it completely functional

**Goal:** Priority journeys are fully functional, production-ready, and instrumented with analytics
**Depends on:** Phase 7
**Requirements:** HARD-01, HARD-02, HARD-03, HARD-04
**Plans:** 3 plans

Plans:
- [ ] 08-01-PLAN.md — Analytics event storage + API logging
- [ ] 08-02-PLAN.md — Journey lead capture CTAs + report polish
- [ ] 08-03-PLAN.md — Journey analytics instrumentation + E2E verification

### Phase 9: Stabilization and deployment hardening

**Goal:** Production releases are stable with staged promotion, observability alerts, reliability safeguards, and strict configuration validation
**Depends on:** Phase 8
**Requirements:** STAB-01, STAB-02, STAB-03, STAB-04
**Plans:** 3 plans

Plans:
- [ ] 09-01-PLAN.md — Observability, health checks, and config validation
- [ ] 09-02-PLAN.md — Per-IP rate limiting at the edge
- [ ] 09-03-PLAN.md — Release workflow docs, incident templates, and build protections

### Phase 10: Fix Netlify 500 error

**Goal:** Fix Netlify deployment 500 Internal Server Error
**Depends on:** Phase 9
**Plans:** 1 plan

Plans:
- [x] 10-01-PLAN.md — Disable instrumentation hook causing startup crash

---

### Phase 11: GitHub Pages Migration

**Goal:** Migrate from Netlify to GitHub Pages with static export configuration
**Depends on:** Phase 10
**Requirements:** Static export, GitHub Actions deployment, client-side API conversion
**Plans:** 3 plans

Plans:
- [ ] 11-01-PLAN.md — Configure Next.js for static export and GitHub Actions
- [ ] 11-02-PLAN.md — Convert API routes to client-side functionality
- [ ] 11-03-PLAN.md — Environment setup and deployment verification

---

### Phase 12: Runtime Data Errors

**Goal:** Static export and runtime pages avoid data-fetch errors from external services
**Depends on:** Phase 11
**Plans:** 1/1 plans complete

Plans:
- [ ] 12-01-PLAN.md — Fix runtime data errors in static export

*Roadmap created: 2026-02-20*
