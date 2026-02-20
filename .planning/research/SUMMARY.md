# Project Research Summary

**Project:** Procedural Integrity Score Dashboard
**Domain:** Federal Spending Data Dashboard with Compliance Scoring
**Researched:** 2026-02-20
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a B2B dashboard product that visualizes federal infrastructure spending (primarily IIJA funds) and applies a procedural compliance scoring methodology to assess project integrity. Experts build这类 dashboards using a modern React stack (Next.js 15 + TypeScript + shadcn/ui) with a PostgreSQL backend, and the core differentiator—the compliance scoring—must be transparent and defensible to government transparency advocates.

The recommended approach prioritizes data quality and scoring methodology credibility over feature velocity. Key risks include USASpending.gov data quality issues (documented by GAO), undefensible scoring methodology, and IIJA-specific data gaps. The 6-8 week timeline requires aggressive scope control: MVP focuses on API integration, search/filter, data table, and defensible scoring methodology. Advanced features (timeline visualization, map view, self-assessment tool) defer to v2.

**Key risk mitigation:** Every scoring component must be documented with legal citations (2 CFR 200, Build America Buy America). Data quality indicators must surface to users. The product's credibility rests on methodology transparency, not just score numbers.

## Key Findings

### Recommended Stack

The recommended stack is the 2026 industry standard for React dashboards:

**Core technologies:**
- **Next.js 15.x** — Full-stack React with Server Components, App Router, ISR for fresh data without rebuilds. Server Components reduce client bundle, built-in API routes handle backend.
- **React 19.x** — Next.js dependency, improved concurrency and actions simplify data mutations.
- **TypeScript 5.x** — Non-negotiable for maintainable dashboards; catches filter/search logic errors early.
- **Tailwind CSS 3.x** — Utility-first styling that pairs with shadcn/ui.
- **shadcn/ui** — Copy-paste component model gives full code ownership, built on Radix UI primitives (accessible), dark mode support.
- **TanStack Table 8.x** — Industry standard for complex tables, handles 10K+ rows with server-side pagination.
- **Recharts 2.x + Tremor 3.x** — SVG-based charting, lightweight (~75kb), Tremor for KPI cards.
- **Supabase (Free tier)** — PostgreSQL + Auth + Auto-generated APIs. Row-level security for lead data.

**Supporting:**
- **React Hook Form + Zod** — Form state with TypeScript-first validation.
- **date-fns** — Date formatting for fiscal years.
- **framer-motion** — Animations for transitions (avoid for core functionality).

### Expected Features

**Must have (table stakes):**
- **USASpending.gov API Integration** — Core data source; mandates rate limit handling (~5K requests/day, must cache).
- **Search + Filters (state, agency, project type)** — Full-text PostgreSQL search via Supabase.
- **Data Table with Pagination** — TanStack Table handles server-side pagination, essential for 10K+ rows.
- **Summary Metrics** — Total spending, project counts by state/agency.
- **Responsive Design** —- **Data Refresh Mobile access expected.
 Indicator** — Show "Data as of [date]" — USASpending updates monthly.

**Should have (competitive differentiators):**
- **Procedural Compliance Scoring** — Core differentiator. Transparent, defensible methodology (weighted combination of checks: timely reporting, funding obligation, milestone compliance, reporting completeness, public docs). Must cite 2 CFR 200, Build America Buy America.
- **Score Methodology Documentation** — Public-facing explainer critical for credibility.
- **Detailed Project Pages** — Score breakdown, compliance history.
- **Email-Gated Detailed Reports** — Lead capture via Supabase Auth (magic link).
- **Agency Comparison View** — Bar charts comparing scores by agency.

**Defer to v2:**
- Timeline visualization (Gantt-style) — High complexity, depends on project date data
- Interactive map view — High complexity
- Self-assessment tool — Builds on scoring methodology proving itself first
- Dark mode, multi-language support, AI chatbot — Not core

### Architecture Approach

The architecture follows a **BFF (Backend-for-Frontend)** pattern where Next.js API routes aggregate data from multiple services before returning to the frontend.

**Major components:**
1. **Presentation Layer** — Dashboard widgets, search components, timeline viewer, lead gate modal
2. **BFF Layer** — Dashboard API, Scoring API, Search API, Lead Gen API (Next.js App Router routes)
3. **Service Layer** — USASpending ingestion, Scoring Engine (rules-based), Project Store, Email Service
4. **Data Layer** — PostgreSQL (projects, scores, leads), Redis (cache), External APIs

**Key patterns:**
- **Declarative Rules Engine** for compliance scoring — Easy to audit, modify without code changes, defensible
- **Progressive Gating** — Summary scores public → detailed projects gated → exports/assessments fully gated
- **Event-Driven Scoring** — Scheduled daily sync triggers scoring recalculations, not on-demand

### Critical Pitfalls

1. **Trusting USASpending.gov Data at Face Value** — GAO reports consistently find missing data, inconsistent reporting. Must build data quality indicators, document limitations, add warning flags for incomplete records.

2. **Undefensible Scoring Methodology** — Transparency advocates will scrutinize. Must document every component with legal citations, publish full methodology with weights, include confidence intervals, allow public comment.

3. **Ignoring IIJA-Specific Data Gaps** — IIJA is new (2021), not all programs report to USASpending yet. Must distinguish obligated vs outlayed vs appropriated, add IIJA-specific quality notes.

4. **Building on Deprecated API Endpoints** — USASpending API is V2 with V1 deprecated. Must use only V2 documented endpoints, build abstraction layer for API changes.

5. **Performance at Scale** — Loading all awards at once causes timeouts. Must paginate, virtualize lists, lazy load for Roadmap

Based details.

## Implications on research, suggested phase structure:

### Phase 1: Foundation & Data Ingestion
**Rationale:** Nothing works without data. USASpending API integration is foundational and all other features depend on it.
**Delivers:** Next.js project setup, PostgreSQL schema (projects, scores, leads), USASpending API client, daily ingestion job, data normalization layer.
**Addresses:** USASpending API Integration (FEATURES.md), Data quality validation (PITFALLS.md #1, #3)
**Avoids:** Pitfall #4 by using only V2 endpoints with abstraction layer
**Stack:** Next.js 15, Supabase, TypeScript, Tailwind, Prisma/Drizzle ORM

### Phase 2: Scoring Engine & Methodology
**Rationale:** Scoring is the core differentiator and must be defensible before launch. This is the highest-risk phase for credibility.
**Delivers:** Rules engine (json-rules-engine), procedural compliance rules with weights, scoring job, methodology documentation page.
**Addresses:** Procedural Compliance Scoring, Score Methodology Documentation (FEATURES.md)
**Avoids:** Pitfall #2 by documenting with legal citations, peer review, confidence intervals
**Stack:** Declarative rules in version-controlled config, scoring service
**Research Flag:** Likely needs `/gsd-research-phase` for scoring methodology validation — consult legal/policy experts on 2 CFR 200 compliance indicators

### Phase 3: Dashboard UI & Table Stakes
**Rationale:** Users need to see data and filter it. This is the baseline product experience.
**Delivers:** Dashboard layout, summary widgets (KPI cards, totals), basic search/filter components, data table with pagination, responsive design, data refresh indicator.
**Addresses:** Search + Filters, Data Table + Pagination, Summary Metrics, Responsive Design (FEATURES.md)
**Avoids:** Performance trap (#5) by implementing pagination and server-side filtering
**Stack:** TanStack Table, Recharts/Tremor, shadcn/ui components

### Phase 4: Advanced Features (v1.5)
**Rationale:** Adds competitive differentiation without blocking launch.
**Delivers:** Detailed project pages with score breakdown, agency comparison view, CSV/Excel export.
**Addresses:** Detailed Project Pages, Agency Comparison View, Export to CSV (FEATURES.md)
**Avoids:** UX pitfalls by showing score breakdowns with context

### Phase 5: Lead Generation (v1.5)
**Rationale:** Validates product-market fit with B2B audience. Requires valuable free content first.
**Delivers:** Email capture modal (progressive gate), lead storage, gated detailed reports, email delivery for reports.
**Addresses:** Email-Gated Detailed Reports (FEATURES.md)
**Stack:** React Hook Form, Zod, Supabase Auth (magic link), Resend/SendGrid

### Phase 6: v2 Features (Deferred)
**Rationale:** High complexity, depend on v1 proving the scoring methodology works.
**Delivers:** Timeline visualization (Gantt), interactive map view, self-assessment tool.
**Defer:** These features have high complexity and depend on scoring methodology validation

### Phase Ordering Rationale

- **Why Foundation first:** All features depend on having project data from USASpending API. Ingestion must handle rate limits and data quality.
- **Why Scoring before Dashboard:** The dashboard's main value prop is the scores. If scoring methodology isn't defensible, the product fails credibility test.
- **Why Lead Gen late:** Progressive gating requires valuable free content first. Users won't convert without seeing value.
- **Why v2 features deferred:** Timeline viz and maps add significant complexity (D3.js, MapLibre). Self-assessment depends on scoring rules being proven.

### Research Flags

Phases needing deeper research during planning:
- **Phase 2 (Scoring Engine):** Complex — needs legal/policy review of 2 CFR 200 compliance indicators. May need expert consultation on Build America Buy America scoring components.
- **Phase 6 (Timeline Visualization):** Niche — Gantt libraries have varying enterprise licensing (frappe-gantt vs DHTMLX). Research needed on timeline data availability in USASpending.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Standard Next.js + Supabase setup, well-documented
- **Phase 3 (Dashboard):** Standard dashboard patterns, TanStack Table + Tremor well-documented
- **Phase 4-5 (Advanced/Lead Gen):** Standard B2B SaaS patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Modern stack verified by Context7 docs, official documentation. Standard 2026 patterns. |
| Features | MEDIUM-HIGH | Table stakes well-understood. Differentiators based on domain research (Gao reports, IIJA compliance). Some defer decisions depend on MVP validation. |
| Architecture | MEDIUM-HIGH | BFF pattern standard for dashboards. Rules engine for scoring is well-documented. Data flow patterns established. |
| Pitfalls | MEDIUM-HIGH | GAO reports provide authoritative backing on data quality issues. Scoring methodology pitfalls well-documented. API stability less certain. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Scoring methodology validation:** Need legal/policy expert review before Phase 2. The methodology must withstand scrutiny from transparency advocates.
- **IIJA data completeness:** Some IIJA programs may not report to USASpending.gov. Need to verify which programs are available vs. need supplementary sources.
- **USASpending API stability:** No control over API changes. Abstraction layer helps but need monitoring process for breaking changes.
- **Self-assessment tool scope:** Too early to define. Defer to Phase 6 research after scoring methodology proven in market.

## Sources

### Primary (HIGH confidence)
- **api.usaspending.gov** — Official V2 API documentation, endpoints, rate limits
- **GAO-24-106214** — Federal Spending Transparency data quality issues
- **GAO-25-107166** — IIJA/DOT Funding Status reporting gaps
- **2 CFR Part 200** — Federal grant compliance requirements (scoring methodology foundation)

### Secondary (MEDIUM confidence)
- **Grist-Data-Desk/ira-tracker** — IIJA/BIL project visualization reference
- **Context7** — Next.js docs, TanStack Table docs, shadcn/ui GitHub
- **transportation.gov** — IIJA grant reporting requirements

### Tertiary (LOW confidence)
- **B2B content gating strategies** — Lead generation best practices, needs validation during Phase 5

---
*Research completed: 2026-02-20*
*Ready for roadmap: yes*
