# Codebase Structure

**Analysis Date:** 2026-02-21

## Directory Layout

```
/Users/dstand/Documents/SFDAN/
├── .github/workflows/          # CI/CD and automation workflows
│   └── generate-insights.yml   # Scheduled weekly insight updates
├── scripts/                    # Standalone automation scripts

│   └── generate-insights.ts    # Weekly insight generation logic
├── public/                     # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components (`page.tsx`), layouts (`layout.tsx`), API handlers (`route.ts`)
- Key files: `page.tsx` (dashboard), `layout.tsx` (root layout)

**`src/components/`:**
- Purpose: Reusable React UI components
- Contains: Data display, forms, charts
- Key files: `DataTable.tsx`, `DashboardMetrics.tsx`, `FilterSidebar.tsx`, `AgencyChart.tsx`

**`src/lib/`:**
- Purpose: Business logic, external API clients, utilities
- Contains: `usaspending.ts` (API client), `scoring.ts` (scoring engine), `api.ts` (search), `auth.ts` (authentication), `supabase.ts` (Supabase client)
- Key files: All `.ts` files (no barrel file observed)

**`src/test/`:**
- Purpose: Test configuration and setup
- Contains: `setup.ts` (Vitest setup with mocks)

**`scripts/`:**
- Purpose: Standalone automation and maintenance scripts
- Contains: `generate-insights.ts` (Weekly insight generation logic)
- Note: Executed via `tsx` in GitHub Actions

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Main dashboard page
- `src/app/layout.tsx`: Root layout with metadata

**Configuration:**
- `package.json`: Dependencies and scripts
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `vitest.config.ts`: Vitest test configuration
- `tsconfig.json`: TypeScript configuration

**Core Logic:**
- `src/lib/usaspending.ts`: USASpending.gov API client
- `src/lib/scoring.ts`: Procedural compliance scoring engine
- `src/lib/api.ts`: Search orchestration layer

**Testing:**
- `src/lib/*.test.ts`: Unit tests for lib functions
- `src/test/setup.ts`: Test configuration and mocks

## Naming Conventions

**Files:**
- Components: PascalCase (`DataTable.tsx`, `FilterSidebar.tsx`)
- Lib utilities: camelCase (`usaspending.ts`, `api.ts`)
- API routes: camelCase (`export/route.ts`, `agency-stats/route.ts`)
- Test files: `.test.ts` suffix (`scoring.test.ts`)

**Directories:**
- Pages: kebab-case (`assess/`, `projects/[id]/`)
- Components: PascalCase (folder if needed, but flat structure used)
- Lib: camelCase flat structure

**Functions:**
- camelCase: `fetchAwards()`, `calculateScore()`, `searchProjects()`
- Async functions prefixed with action: `fetch*`, `search*`, `calculate*`

**Types/Interfaces:**
- PascalCase: `SearchParams`, `SearchResult`, `AwardData`, `ScoreBreakdown`

## Where to Add New Code

**New Feature (Page):**
- Implementation: Create directory in `src/app/[feature-name]/page.tsx`
- Tests: Create `src/lib/[feature-name].test.ts` for any new lib logic

**New Component:**
- Implementation: Add to `src/components/ComponentName.tsx`
- Follow pattern: `'use client'` if uses hooks/state

**New API Endpoint:**
- Implementation: Create `src/app/api/[endpoint]/route.ts`
- Follow pattern: Export named `GET`, `POST`, etc.

**New Lib Function:**
- Implementation: Add to appropriate file in `src/lib/` or create new file
- Example: New scoring rules → `src/lib/scoring.ts`

**New Utility:**
- Implementation: Add to existing lib file or create `src/lib/utils.ts`

## Special Directories

**`src/app/api/`:**
- Purpose: API route handlers (Serverless functions)
- Generated: No (written manually)
- Committed: Yes

**Dynamic Routes:**
- Purpose: `src/app/projects/[id]/` captures project ID from URL
- Access via: Page component params

## Import Patterns

**Path Aliases:**
- `@/` maps to `src/` (configured in tsconfig.json)
- Example: `import { fetchAwards } from '@/lib/usaspending'`

**Import Order (observed):**
1. React/Next imports
2. External libraries
3. Internal components (`@/components/...`)
4. Internal lib (`@/lib/...`)

---

*Structure analysis: 2026-02-21*
