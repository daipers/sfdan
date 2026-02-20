# Stack Research

**Domain:** Federal Spending Data Dashboard
**Researched:** 2026-02-20
**Confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | Full-stack React framework with App Router | Industry standard for React dashboards in 2026. Server Components reduce client bundle size, built-in API routes handle backend logic, ISR enables fresh data without rebuilding. |
| React | 19.x | UI library | Next.js dependency. React 19's improved concurrency and actions simplify data mutations. |
| TypeScript | 5.x | Type safety | Non-negotiable for maintainable dashboards. Catches filter/search logic errors early. |
| Tailwind CSS | 3.x | Styling | Works seamlessly with shadcn/ui. Utility-first pairs well with component libraries. |

### UI Components

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| shadcn/ui | latest | Component library | Copy-paste model gives full code ownership. Built on Radix UI primitives (accessible). Integrates with Tailwind. Dark mode support out of box. |
| TanStack Table | 8.x | Data tables | Industry standard for complex tables. Handles 10K+ rows with sorting, filtering, pagination. Server-side support for large USASpending datasets. |
| Recharts | 2.x | Charts/visualization | React-native SVG rendering, lightweight (~75kb), declarative components. Sufficient for spending breakdowns. |
| Tremor | 3.x | Dashboard components | Built on Recharts + Tailwind. Pre-built KPI cards, charts optimized for dashboards. Use for quick metric displays. |

### Database & Backend

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Supabase | Free tier | PostgreSQL + Auth + API | PostgreSQL under the hood (query USASpending data directly). Auto-generated REST/GraphQL APIs. Built-in auth for gated content. Row-level security for lead data. |
| Supabase Edge Functions | - | Serverless functions | Run scoring logic server-side without separate backend. |

### Search & Filtering

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| PostgreSQL Full-Text Search | Filter state, agency, project type | Supabase provides pg_trgm for fuzzy matching. No external search service needed for this scale. |

### Lead Capture

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| React Hook Form | Form state management | Minimal re-renders, integrates with Zod validation. |
| Zod | Schema validation | TypeScript-first, validates email format for gated reports. |
| Supabase Auth | Email-gated content | Handle email-only signups, store in same database as project data. |

### API Integration

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| fetch (native) | USASpending.gov API calls | Server Components can fetch directly. No client axios needed. |
| TanStack Query | Client-side caching (optional) | If adding interactive refresh buttons. |

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 4.x | Date formatting | Format IIJA project timelines, fiscal year calculations. |
| framer-motion | 12.x | Animations | Page transitions, loading states. Avoid for core functionality. |
| next-safe-action | - | Server actions | Type-safe API routes for form submissions. |

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vercel | Deployment | Native Next.js support, ISR preview. |
| ESLint + Prettier | Code quality | Pre-configured in Next.js. |
| Biome | Linting (alternative) | Faster than ESLint, single tool. |

## Installation

```bash
# Core
npx create-next-app@latest procedural-integrity-dashboard --typescript --tailwind --eslint
cd procedural-integrity-dashboard

# UI Components
npx shadcn@latest init
npx shadcn@latest add table card button input select dialog form toast

# Data & Tables
npm install @tanstack/react-table recharts @tremor/react

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Database
npm install @supabase/supabase-js @supabase/ssr

# Utilities
npm install date-fns framer-motion
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| Next.js 15 | Remix | If prefer nested routes or simpler data loading model. |
| shadcn/ui | Mantine | If need pre-built complex components (date picker ranges). |
| Supabase | PlanetScale | If expecting >100K rows queries, need horizontal scaling. |
| Recharts | Tremor + Recharts | Tremor is built on Recharts — use Tremor for KPIs, Recharts for custom. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App | Deprecated, no SSR support | Next.js (App Router) |
| jQuery | Not React-idiomatic, large bundle | React + TanStack Table |
| Client-side only fetching | SEO issues, slower FCP | Server Components with fetch |
| Firebase | Vendor lock-in, no PostgreSQL | Supabase (PostgreSQL) |
| Redux | Overkill for dashboard state | React Server Components + React Context |
| Chart.js | Canvas-based, harder to customize | Recharts (SVG, React-native) |

## Stack Patterns by Variant

**If timeline visualization is critical (Gantt-style):**
- Add `frappe-gantt` or `react-timeline-gantt` for project timeline views
- Consider DHTMLX Gantt if enterprise features needed (licensing cost)

**If self-assessment tool is complex:**
- Add `@formkit/auto-animate` for smooth form transitions
- Use Zod for scoring methodology validation

**If real-time updates needed:**
- Add Supabase Realtime for live score recalculations

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 15 | React 19 | Use `next@latest` |
| shadcn/ui | Tailwind 3.x | v4 requires config changes |
| TanStack Table 8 | React 18/19 | Works with both |
| Supabase JS | PostgreSQL 15+ | Let Supabase handle |
| Tremor 3 | Tailwind 3.x | Not compatible with Tailwind 4 |

## Sources

- Context7: Next.js docs, TanStack Table docs, shadcn/ui GitHub
- Official docs: api.usaspending.gov, supabase.com/docs
- WebSearch: "React dashboard best practices 2026", "shadcn/ui dashboard tutorial"
- Code Search: refine.dev blog, designrevision.com shadcn guide

---

*Stack research for: Procedural Integrity Score Dashboard*
*Researched: 2026-02-20*
