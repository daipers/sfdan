# Roadmap: Procedural Integrity Score Dashboard

## Phases

- [ ] **Phase 1: Foundation & Data Ingestion** - Set up Next.js project, connect to USASpending.gov API, implement caching layer
- [ ] **Phase 2: Scoring Engine** - Build procedural compliance scoring with defensible methodology and regulatory citations
- [ ] **Phase 3: Dashboard & Search** - Create searchable dashboard with filters, data table, and summary metrics
- [ ] **Phase 4: Details & Lead Gen** - Build project detail pages and email-gated lead generation

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
- [ ] 03-01-PLAN.md — Core infrastructure (dependencies, URL state, API layer)
- [ ] 03-02-PLAN.md — Data table and filter components
- [ ] 03-03-PLAN.md — Summary metrics and mobile responsiveness

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

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Ingestion | 1/1 | Completed | 2026-02-20 |
| 2. Scoring Engine | 1/1 | Completed | 2026-02-20 |
| 3. Dashboard & Search | 0/3 | Ready | - |
| 4. Details & Lead Gen | 0/1 | Not started | - |

---

## Dependencies

```
Phase 1 ─────> Phase 2 ─────> Phase 3 ─────> Phase 4
   (data)       (scoring)       (UI)          (gated)
```

---

## Notes

- **Depth:** quick (3-5 phases) - 4 phases selected
- **Timeline:** 6-8 weeks
- **Audience:** Government watchdog journalists, municipal finance officers, inspector general community
- **Core value:** Defensible procedural compliance scoring

---

*Roadmap created: 2026-02-20*
