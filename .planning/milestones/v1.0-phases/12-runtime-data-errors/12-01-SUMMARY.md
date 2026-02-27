---
phase: 12-runtime-data-errors
plan: 01
subsystem: api
tags: [supabase, usaspending, static-export, nextjs]

# Dependency graph
requires:
  - phase: 11-github-pages-migration
    provides: GitHub Pages static export pipeline
provides:
  - Award-by-id filters aligned with search payload
  - Fallback content when Supabase tables are missing
  - Static-export-safe export and insights API guards
affects: [content, api, static-export]

# Tech tracking
tech-stack:
  added: []
  patterns: [STATIC_EXPORT guards for API routes, fallback content for missing Supabase tables]

key-files:
  created: [src/lib/content-fallback.ts, .planning/phases/12-runtime-data-errors/12-USER-SETUP.md, .planning/phases/12-runtime-data-errors/12-01-SUMMARY.md]
  modified: [src/lib/usaspending.ts, src/lib/content.ts, src/app/api/export/route.ts, src/app/api/insights/route.ts, src/app/content/[slug]/page.tsx, .planning/STATE.md, .planning/ROADMAP.md]

key-decisions:
  - "Return 501 JSON responses for API routes when STATIC_EXPORT is enabled to keep static builds clean."
  - "Use fallback content for missing Supabase content_posts to keep content pages renderable."

patterns-established:
  - "Static export guards should short-circuit before reading request data."
  - "Fallback content should mirror placeholder slugs for static export."

requirements-completed: []

# Metrics
duration: 0 min
completed: 2026-02-25
---

# Phase 12 Plan 01: Runtime Data Errors Summary

**Static export now survives missing Supabase content tables, award-by-id fetches include required filters, and export/insights routes short-circuit safely in GitHub Pages builds.**

## Performance

- **Duration:** 0 min
- **Started:** 2026-02-25T07:40:50Z
- **Completed:** 2026-02-25T07:41:21Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Aligned award-by-id filters with USASpending search payload to prevent 422s.
- Added fallback content and missing-table handling to keep content pages renderable during static export.
- Guarded export and insights routes plus content auth checks for static builds.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix award-by-id filters for USASpending** - `a4312068` (fix)
2. **Task 2: Add fallback content for missing content_posts** - `da4ec5d0` (feat)
3. **Task 3: Make export route static-export safe** - `43ac801c` (fix)

**Plan metadata:** [pending]

## Files Created/Modified
- `src/lib/usaspending.ts` - Adds shared award filters to award-by-id fetch.
- `src/lib/content-fallback.ts` - Supplies placeholder content for static export.
- `src/lib/content.ts` - Uses fallback content on missing Supabase tables.
- `src/app/api/export/route.ts` - Adds STATIC_EXPORT guard and nextUrl parsing.
- `src/app/api/insights/route.ts` - Short-circuits static export API responses.
- `src/app/content/[slug]/page.tsx` - Avoids auth cookie reads during static export.
- `.planning/phases/12-runtime-data-errors/12-USER-SETUP.md` - Supabase setup steps.

## Decisions Made
- Return 501 JSON responses for static-export API routes to avoid build-time request usage.
- Use fallback content for missing content_posts so content pages render during export.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Static build failed on API request access**
- **Found during:** Verification (npm run build:static)
- **Issue:** /api/insights used request data during static export; content detail used cookies.
- **Fix:** Added STATIC_EXPORT guard to insights API and skipped auth cookie access for static content pages.
- **Files modified:** src/app/api/insights/route.ts, src/app/content/[slug]/page.tsx
- **Verification:** npm run build:static
- **Committed in:** 120925ef (post-task fix)

---

**Total deviations:** 1 auto-fixed (Rule 3)
**Impact on plan:** Required for successful static export; no scope creep beyond build blockers.

## Issues Encountered
- Initial static export failed due to request-dependent API route and cookie usage; resolved with static guards.

## User Setup Required

**External services require manual configuration.** See `12-USER-SETUP.md` for:
- Supabase SQL editor task to create `content_posts`

## Next Phase Readiness
Phase complete and ready for transition once Supabase schema update is applied.

---
*Phase: 12-runtime-data-errors*
*Completed: 2026-02-25*

## Self-Check: PASSED
