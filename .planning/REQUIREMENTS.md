# Requirements: Procedural Integrity Score Dashboard

**Defined:** 2026-02-20
**Core Value:** Apply transparent, defensible procedural compliance scoring to IIJA federal infrastructure spending to help watchdog audiences identify potential issues and benchmark project integrity.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Data Integration

- [ ] **DATA-01**: Connect to USASpending.gov API v2 endpoints for award data
- [ ] **DATA-02**: Implement caching layer to handle API rate limits (~5K requests/day)
- [ ] **DATA-03**: Sync IIJA-specific awards (filter by funding agency, assistance type)
- [ ] **DATA-04**: Display data currency indicator ("Data as of [date]")
- [ ] **DATA-05**: Handle API errors gracefully with user feedback

### Search & Filtering

- [ ] **FILT-01**: Keyword search across project names, descriptions
- [ ] **FILT-02**: Filter by US state/territory
- [ ] **FILT-03**: Filter by federal agency (DOE, DOT, EPA, etc.)
- [ ] **FILT-04**: Filter by project category (transportation, broadband, clean energy)
- [ ] **FILT-05**: Combine multiple filters (AND logic)

### Data Display

- [ ] **TABL-01**: Paginated data table showing projects with key fields
- [ ] **TABL-02**: Server-side pagination for large datasets (>10K rows)
- [ ] **TABL-03**: Sort by columns (amount, date, score)
- [ ] **TABL-04**: Summary metrics dashboard (total spending, project counts)
- [ ] **TABL-05**: Responsive design for mobile access

### Procedural Compliance Scoring

- [ ] **SCR-01**: Implement scoring engine with defined rule set
- [ ] **SCR-02**: Score based on: environmental review timing, competitive bidding window, modification authorization
- [ ] **SCR-03**: Calculate weighted composite score per project
- [ ] **SCR-04**: Display score prominently on each project row
- [ ] **SCR-05**: Document scoring methodology with regulatory citations (2 CFR 200, Build America Buy America, Davis-Bacon)

### Detailed Project View

- [ ] **PROJ-01**: Individual project detail pages
- [ ] **PROJ-02**: Show score breakdown by compliance category
- [ ] **PROJ-03**: Display project timeline and key dates
- [ ] **PROJ-04**: Link to source data on USASpending.gov

### Lead Generation

- [ ] **LEAD-01**: Email capture form for detailed project reports
- [ ] **LEAD-02**: Magic link authentication via Supabase Auth
- [ ] **LEAD-03**: Generate PDF report for gated download
- [ ] **LEAD-04**: Store leads in Supabase with role/organization fields

### Documentation

- [ ] **DOC-01**: Public-facing methodology explainer page
- [ ] **DOC-02**: FAQ section addressing scoring questions
- [ ] **DOC-03**: Data sources and update frequency page

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Visualization

- **VIZ-01**: Timeline visualization (Gantt-style) of project phases
- **VIZ-02**: Interactive map view of projects by location
- **VIZ-03**: Agency comparison charts

### Self-Assessment

- **SELF-01**: Form wizard for entities to input own project data
- **SELF-02**: Private compliance score calculation
- **SELF-03**: Benchmark comparison against public data

### Content

- **CONT-01**: Automated finding alerts (e.g., "X% of projects have timing violations")
- **CONT-02**: Export to CSV/Excel

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time API polling | USASpending updates monthly; unnecessary complexity |
| User accounts with passwords | Adds friction; email magic link sufficient |
| Mobile app | Over-engineering for 6-8 week timeline |
| Social sharing | Not aligned with B2B/government audience |
| Commenting/user content | Requires moderation, off-topic |
| AI chatbot | Hallucination risk with compliance data |
| Dark mode | Nice-to-have, defer to v2 |
| Multi-language support | US-focused product |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| DATA-05 | Phase 1 | Pending |
| FILT-01 | Phase 2 | Pending |
| FILT-02 | Phase 2 | Pending |
| FILT-03 | Phase 2 | Pending |
| FILT-04 | Phase 2 | Pending |
| FILT-05 | Phase 2 | Pending |
| TABL-01 | Phase 2 | Pending |
| TABL-02 | Phase 2 | Pending |
| TABL-03 | Phase 2 | Pending |
| TABL-04 | Phase 2 | Pending |
| TABL-05 | Phase 2 | Pending |
| SCR-01 | Phase 3 | Pending |
| SCR-02 | Phase 3 | Pending |
| SCR-03 | Phase 3 | Pending |
| SCR-04 | Phase 3 | Pending |
| SCR-05 | Phase 3 | Pending |
| PROJ-01 | Phase 4 | Pending |
| PROJ-02 | Phase 4 | Pending |
| PROJ-03 | Phase 4 | Pending |
| PROJ-04 | Phase 4 | Pending |
| LEAD-01 | Phase 5 | Pending |
| LEAD-02 | Phase 5 | Pending |
| LEAD-03 | Phase 5 | Pending |
| LEAD-04 | Phase 5 | Pending |
| DOC-01 | Phase 5 | Pending |
| DOC-02 | Phase 5 | Pending |
| DOC-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-20*
*Last updated: 2026-02-20 after auto-mode requirements generation*
