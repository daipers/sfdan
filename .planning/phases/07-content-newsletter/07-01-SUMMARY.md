---
phase: 07-content-newsletter
plan: 01
subsystem: api
tags: [supabase, newsletter, magic-link, nextjs]

# Dependency graph
requires:
  - phase: 06-polish
    provides: Magic link auth flow, site layout patterns
provides:
  - Newsletter subscribers schema and API
  - Newsletter signup form and /newsletter page
  - Site-wide footer with newsletter entry point
affects: [07-02-PLAN.md, 07-03-PLAN.md]

# Tech tracking
tech-stack:
  added: []
  patterns: [Configurable magic link redirects, Newsletter signups stored via service-role upsert]

key-files:
  created:
    - src/app/api/newsletter/subscribe/route.ts
    - src/components/NewsletterSignupForm.tsx
    - src/app/newsletter/page.tsx
    - src/components/SiteFooter.tsx
  modified:
    - supabase/schema.sql
    - src/lib/auth.ts
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/gated-reports/page.tsx
    - src/app/assess/page.tsx
    - .planning/phases/07-content-newsletter/07-USER-SETUP.md

key-decisions:
  - "Magic link confirmations for newsletter signups redirect to /newsletter to keep users on the landing page."
  - "Newsletter interests captured as checkbox selections stored in a text[] field for flexible filtering."
  - "SiteFooter component rendered in RootLayout to provide consistent newsletter entry points."

patterns-established:
  - "Newsletter signup flows use a dedicated API route with validation + non-leaky responses."
  - "Shared footer content lives in a single SiteFooter component."

requirements-completed: []

# Metrics
duration: 5 min
completed: 2026-02-22
---

# Phase 7 Plan 1: Content Newsletter Summary

**Newsletter signup flow with Supabase-backed subscribers, magic-link confirmation, and a dedicated /newsletter landing page.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-22T02:03:46Z
- **Completed:** 2026-02-22T02:09:16Z
- **Tasks:** 6
- **Files modified:** 11

## Accomplishments
- Added newsletter_subscribers schema with RLS policies and update triggers for secure signup storage.
- Implemented newsletter subscribe API plus a client signup form with inline success state.
- Launched a dedicated /newsletter page and added consistent footer + navigation entry points.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add newsletter_subscribers table to Supabase schema** - `8c812bff` (feat)
2. **Task 2: Extend auth helper for configurable magic link redirect** - `62737f3f` (feat)
3. **Task 3: Create newsletter subscribe API route** - `bba53d98` (feat)
4. **Task 4: Build NewsletterSignupForm component** - `4f5ae4b5` (feat)
5. **Task 5: Create newsletter page** - `1d88d453` (feat)
6. **Task 6: Add newsletter link in navigation and footer** - `94534bc0` (feat)

**Plan metadata:** Pending (docs commit after SUMMARY/STATE/ROADMAP updates)

## Files Created/Modified
- `supabase/schema.sql` - Newsletter subscribers schema, RLS policies, indexes, triggers
- `src/lib/auth.ts` - Optional redirectPath support for magic link helpers
- `src/app/api/newsletter/subscribe/route.ts` - Newsletter subscribe endpoint
- `src/components/NewsletterSignupForm.tsx` - Newsletter signup form with interests + inline success
- `src/app/newsletter/page.tsx` - Newsletter landing page content and layout
- `src/components/SiteFooter.tsx` - Shared footer with newsletter entry point
- `src/app/layout.tsx` - Root layout now renders SiteFooter
- `src/app/page.tsx` - Added newsletter link to home navigation
- `src/app/gated-reports/page.tsx` - Removed per-page footer to avoid duplication
- `src/app/assess/page.tsx` - Removed per-page footer to avoid duplication
- `.planning/phases/07-content-newsletter/07-USER-SETUP.md` - Supabase setup checklist updates

## Decisions Made
- Magic link confirmations for newsletter signups redirect back to `/newsletter` to keep context.
- Interests captured as checkbox selections and stored as text[] for future filtering.
- Global footer rendered in RootLayout for consistent newsletter access.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed per-page footers after adding SiteFooter**
- **Found during:** Task 6 (Add newsletter link in navigation and footer)
- **Issue:** Pages already had individual footers, causing duplicate footers once SiteFooter was added globally.
- **Fix:** Removed per-page footer blocks from gated reports, assess, and newsletter pages.
- **Files modified:** `src/app/gated-reports/page.tsx`, `src/app/assess/page.tsx`, `src/app/newsletter/page.tsx`
- **Verification:** `npm run build`
- **Committed in:** `94534bc0`

---

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Prevented duplicate footer rendering; no scope expansion.

## Issues Encountered
None.

## User Setup Required

**External services require manual configuration.** See `./07-USER-SETUP.md` for:
- Environment variables to add
- Supabase dashboard SQL steps
- Verification commands

## Next Phase Readiness
- Newsletter signup flow is ready once Supabase env vars and SQL are applied.
- Ready for 07-02 automated insights generation after user setup.

---
*Phase: 07-content-newsletter*
*Completed: 2026-02-22*

## Self-Check: PASSED
