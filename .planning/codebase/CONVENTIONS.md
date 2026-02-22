# Coding Conventions

**Analysis Date:** 2026-02-21

## Naming Patterns

**Files:**
- Components use PascalCase: `src/components/DataTable.tsx`, `src/components/AssessmentWizard.tsx`
- Lib utilities use kebab/camel style filenames: `src/lib/usaspending.ts`, `src/lib/self-assessment.ts`
- Pages follow Next.js App Router conventions: `src/app/page.tsx`, `src/app/assess/page.tsx`, `src/app/projects/[id]/page.tsx`
- API routes use `route.ts`: `src/app/api/export/route.ts`, `src/app/api/agency-stats/route.ts`
- Tests use `.test.ts`: `src/lib/scoring.test.ts`, `src/lib/export.test.ts`

**Functions:**
- camelCase for functions and hooks: `calculateScore()`, `fetchAwards()`, `searchProjects()` in `src/lib/scoring.ts`, `src/lib/usaspending.ts`, `src/lib/api.ts`
- Async functions prefixed by action verbs: `fetchAwards()` in `src/lib/usaspending.ts`, `sendMagicLink()` in `src/lib/auth.ts`

**Variables:**
- camelCase for variables and state: `searchResult`, `isLoading`, `hasScore` in `src/app/page.tsx`, `src/components/AssessmentWizard.tsx`, `src/components/AwardCard.tsx`

**Types:**
- PascalCase for interfaces/types: `SearchParams`, `AwardData`, `ScoreBreakdown` in `src/lib/api.ts`, `src/lib/usaspending.ts`, `src/lib/scoring.ts`

## Code Style

**Formatting:**
- No explicit formatter config detected (`.prettierrc*` absent)
- Mixed semicolon usage: none in `src/components/DataTable.tsx`, present in `src/components/AwardCard.tsx`
- Single quotes for imports in most files (e.g., `src/app/page.tsx`, `src/lib/api.ts`)

**Linting:**
- Next.js ESLint via `next lint` in `package.json`
- No custom ESLint config detected

## Import Organization

**Order:**
1. React/Next imports (`react`, `next/link`, `next/server`)
2. External libraries (`nuqs`, `@tanstack/react-table`, `@supabase/ssr`)
3. Internal aliases (`@/lib/...`, `@/components/...`)
4. Relative imports (`./scoring`, `./export`)

**Path Aliases:**
- `@/*` maps to `src/*` in `tsconfig.json`
- Example: `import { searchProjects } from '@/lib/api'` in `src/app/page.tsx`

## Error Handling

**Patterns:**
- Try/catch for async operations with console logging: `src/app/page.tsx`, `src/components/ExportButton.tsx`, `src/app/projects/[id]/page.tsx`
- API routes return JSON error objects with status codes: `src/app/api/export/route.ts`, `src/app/api/agency-stats/route.ts`
- Global error boundary uses `src/app/error.tsx` with `reset()` for recovery

## Logging

**Framework:** `console`

**Patterns:**
- `console.error()` in error paths: `src/app/error.tsx`, `src/lib/usaspending.ts`, `src/components/DashboardMetrics.tsx`
- `console.warn()` for missing config: `src/lib/supabase.ts`

## Comments

**When to Comment:**
- Short inline comments to explain non-obvious logic (e.g., filtering/sorting notes) in `src/lib/api.ts`
- Block comments for sections and component parts in `src/components/AssessmentWizard.tsx`

**JSDoc/TSDoc:**
- Used on exported functions and modules in lib files: `src/lib/usaspending.ts`, `src/lib/scoring.ts`

## Function Design

**Size:**
- Small/medium pure functions in `src/lib/` (e.g., `calculateScore()` in `src/lib/scoring.ts`)
- Larger UI components with internal helper functions in `src/components/AssessmentWizard.tsx`

**Parameters:**
- Typed parameters/interfaces for data shapes: `SearchParams` in `src/lib/api.ts`, `SelfAssessmentInput` in `src/lib/self-assessment.ts`

**Return Values:**
- Functions return typed objects, often with fallback defaults for missing data (e.g., `transformForExport()` in `src/lib/export.ts`)

## Module Design

**Exports:**
- Named exports for utilities/components: `export function DataTable` in `src/components/DataTable.tsx`
- Default exports for Next.js page components: `src/app/page.tsx`, `src/app/assess/page.tsx`

**Barrel Files:**
- Not used; modules import directly from files (e.g., `@/lib/usaspending`, `@/components/DataTable`)

---

*Convention analysis: 2026-02-21*
