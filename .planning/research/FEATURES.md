# Feature Landscape

**Domain:** Federal Spending Data Dashboard
**Researched:** 2026-02-20
**Confidence:** MEDIUM-HIGH

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| USASpending.gov API Integration | Core data source; mandated by project constraints | Medium | API v2 endpoints for awards, agencies, spending. Rate limits ~5K requests/day. Must cache to avoid hitting limits. |
| Basic Search (keyword) | Found in every government data site | Low | Native PostgreSQL full-text search via Supabase. Simple, fast. |
| Filter by State | Primary geographic unit for IIJA spending | Low | USASpending API supports state filters. Pre-aggregate for performance. |
| Filter by Agency | Federal agency is core dimension | Low | DOE, DOT, EPA, etc. as top-level filters. |
| Filter by Project Type/Category | Infrastructure categories (transportation, broadband, clean energy) | Medium | Requires mapping USASpending `award_type` to IIJA categories. |
| Data Table with Pagination | Handle large datasets (>10K rows) | Medium | TanStack Table handles server-side pagination. Essential for usability. |
| Summary Metrics (totals, counts) | Dashboard baseline expectations | Low | Total spending, project counts, by state/agency. |
| Responsive Design | Mobile access expected | Low | Tailwind CSS handles this. |
| Data Refresh Indicator | Users need to know data currency | Low | Show "Data as of [date]" from API. USASpending updates monthly. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Procedural Compliance Scoring | **Core differentiator** - transparent, defensible scoring methodology applied to IIJA spending | High | Must document methodology (2 CFR 200 compliance, Build America Buy America, Davis-Bacon). Score = weighted combination of checks. Public methodology builds trust. |
| Timeline Visualization (Gantt-style) | Visualize project phases and milestones | High | IIJA projects have multi-year timelines. Grist IRA-tracker shows this is valued. Libraries: frappe-gantt or react-timeline-gantt. |
| Interactive Map View | Geographic visualization of projects | Medium | Similar to Grist IRA/BIL tracker. MapLibre GL + PMTiles. Most compelling for state/local audiences. |
| Detailed Project Pages | Deep dive into individual projects | Medium | Links from dashboard to project detail. Shows scoring breakdown, compliance history. |
| Email-Gated Detailed Reports | Lead capture for high-value exports | Low-Medium | 2025 B2B best practice: gate strategic content (ROI reports, custom analysis). Email-only signup via Supabase Auth. |
| Self-Assessment Tool (form-gated) | Allow entities to assess their own compliance | Medium | Form wizard for state/local governments to input project data and get compliance score. Differentiator for B2G sales. |
| Agency Comparison View | Compare compliance across agencies | Medium | Bar charts comparing scores by agency. Shows outliers. |
| Trend Analysis | Spending over time, compliance trends | Medium | Time-series of IIJA spending vs. compliance scores. |
| Export to CSV/Excel | Data portability for analysts | Low | Standard expectation for data products. TanStack Table has export plugin. |
| Score Methodology Documentation | Public-facing explainer of how scoring works | Low | Critical for credibility. PDF or dedicated page explaining each compliance check. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real-time API polling | USASpending updates monthly; unnecessary complexity | Daily or weekly sync job (cron). Show "data as of" date. |
| User accounts with passwords | Adds friction, maintenance burden | Email-only authentication (magic link) for gated content. |
| Custom API endpoint creation | Out of scope, high complexity | Focus on scoring engine instead. |
| Mobile app | Over-engineering for 6-8 week timeline | Responsive web is sufficient. |
| Social sharing features | Not aligned with B2B/government audience | Focus on export functionality. |
| Commenting/user-generated content | Requires moderation, off-topic for compliance data | Omit. |
| Dark mode | Nice-to-have, not core | Defer to v2. |
| Multi-language support | Not required for US-focused product | Omit. |
| Automated alerts/notifications | Adds complexity, no clear user need | Defer. |
| Chatbot/AI assistant | Hallucination risk with compliance data | Omit. Users need authoritative answers. |

## Feature Dependencies

```
USASpending API Integration
    ↓
Basic Search + Filters
    ↓
Data Table with Pagination ──→ Summary Metrics
    ↓
Procedural Compliance Scoring
    ↓
Detailed Project Pages ──→ Agency Comparison View
    ↓
Timeline Visualization
    ↓
Email-Gated Reports
    ↓
Self-Assessment Tool
```

**Dependency Notes:**
- Scoring requires API integration + filters working first
- Timeline viz depends on having project dates from API (award period)
- Gated content depends on having valuable free content first
- Self-assessment builds on scoring methodology

## MVP Recommendation

Prioritize in order:
1. **USASpending API Integration** - foundational
2. **Basic Search + Filters (state, agency, category)** - table stakes
3. **Data Table + Pagination** - essential for usability
4. **Procedural Compliance Scoring** - core differentiator, must be defensible
5. **Score Methodology Documentation** - builds trust
6. **Email-gated detailed reports** - validates product-market fit

Defer:
- Timeline visualization: Nice-to-have, depends on having project date data working
- Self-assessment tool: V2 feature after scoring methodology proven
- Interactive map: High complexity,Gr dependencies on other features first

## Sources

- api.usaspending.gov - Official API documentation (V2 endpoints)
- github.com/Grist-Data-Desk/ira-tracker - IIJA/BIL project visualization reference
- brixongroup.com - B2B content gating strategies 2025
- ziggy.agency - SaaS content gating decision framework
- ey.com - IIJA compliance for state governments
- transportation.gov - IIJA grant reporting requirements (2025)
- 2 CFR Part 200 - Federal grant compliance requirements

---

*Research for: Procedural Integrity Score Dashboard*
