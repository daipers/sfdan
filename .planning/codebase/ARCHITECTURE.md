# Architecture

**Analysis Date:** 2026-02-21

## Pattern Overview

**Overall:** Next.js App Router with Server-Side Data Fetching

**Key Characteristics:**
- Server Components by default, client components only where interactivity is needed
- Server-side API integration with USASpending.gov external API
- URL-driven state management using `nuqs` for search params
- Separation between data fetching (lib), UI (components), and routing (app)

## Layers

**Routing Layer (`src/app/`):**
- Purpose: Next.js App Router pages and API routes
- Location: `src/app/`
- Contains: Page components, API route handlers, layouts, loading/error states
- Depends on: lib layer for data, components layer for UI
- Used by: Browser/Client

**Data/Logic Layer (`src/lib/`):**
- Purpose: Business logic, API clients, scoring engine
- Location: `src/lib/`
- Contains: `usaspending.ts` (API client), `scoring.ts` (compliance scoring), `api.ts` (search orchestration), `auth.ts` (authentication)
- Depends on: External APIs (USASpending.gov, Supabase)
- Used by: App pages, API routes, components

**Presentation Layer (`src/components/`):**
- Purpose: Reusable UI components
- Location: `src/components/`
- Contains: DataTable, DashboardMetrics, FilterSidebar, Charts, Forms
- Depends on: lib layer for data types and utilities
- Used by: App pages

## Data Flow

**Dashboard Search Flow:**

1. User interacts with filters/pagination on `src/app/page.tsx`
2. `nuqs` updates URL search params
3. Client component calls `searchProjects()` from `src/lib/api.ts`
4. `api.ts` calls `fetchAwards()` from `src/lib/usaspending.ts`
5. USASpending.gov API returns raw award data
6. `scoring.ts` calculates compliance scores for each award
7. Results returned to component, rendered in `DataTable`

**API Export Flow:**

1. User clicks ExportButton
2. Browser navigates to `/api/export?format=csv&...`
3. `src/app/api/export/route.ts` handles request
4. Route calls `searchProjects()` with export params
5. `generateCSV()` or `generateExcel()` produces file
6. File returned as download

**Agency Stats Flow:**

1. Dashboard may fetch `/api/agency-stats`
2. `src/app/api/agency-stats/route.ts` caches results
3. Calls `fetchAwards()` then aggregates via `calculateAgencyStats()`
4. Returns JSON for charting

## Key Abstractions

**Scoring Engine:**
- Purpose: Calculate procedural compliance scores for federal awards
- Examples: `src/lib/scoring.ts`
- Pattern: Rule-based evaluation with weighted components (environmental 35%, competitive bidding 35%, modification auth 30%)

**API Client:**
- Purpose: Interface to USASpending.gov API
- Examples: `src/lib/usaspending.ts`
- Pattern: Typed wrapper around REST API with caching via Next.js `next: { revalidate }`

**Search Orchestration:**
- Purpose: Transform user filters into API calls with client-side post-processing
- Examples: `src/lib/api.ts`
- Pattern: Facade that combines API calls with filtering, sorting, pagination

## Entry Points

**Page Entry Points:**
- `/` (`src/app/page.tsx`): Main dashboard with search and data table
- `/assess` (`src/app/assess/page.tsx`): Self-assessment wizard
- `/projects/[id]` (`src/app/projects/[id]/page.tsx`): Individual project detail
- `/gated-reports` (`src/app/gated-reports/page.tsx`): Auth-gated reports
- `/api/export` (`src/app/api/export/route.ts`): Data export endpoint
- `/api/agency-stats` (`src/app/api/agency-stats/route.ts`): Agency comparison data
- `/api/auth/magic-link` (`src/app/api/auth/magic-link/route.ts`): Authentication

**Root Layout:**
- `src/app/layout.tsx`: Root layout with metadata, NuqsAdapter wrapper

## Error Handling

**Strategy:** Try-catch with user-friendly error messages

**Patterns:**
- Page-level error states: `src/app/error.tsx` for error boundaries
- API routes return JSON error responses with status codes
- Client components catch async errors and display user messages
- Console logging for debugging (no structured logging observed)

## Cross-Cutting Concerns

**Logging:** `console.error()` for errors, `console.warn()` for missing config

**Validation:** None observed at API boundary - relies on client-side typing and runtime checks

**Authentication:** Supabase Auth with magic links (`src/lib/auth.ts`, `src/lib/supabase.ts`)

**Caching:**
- Next.js ISR via `next: { revalidate: 3600 }` on external API calls
- In-memory cache in API routes (agency-stats)

---

*Architecture analysis: 2026-02-21*
