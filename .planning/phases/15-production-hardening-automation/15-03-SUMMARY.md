---
phase: 15-production-hardening-automation
plan: 03
subsystem: api
tags: [github-actions, supabase, typescript, tsx, automation]

# Dependency graph
requires:
  - phase: 15-production-hardening-automation
    provides: [15-02-SUMMARY.md]
provides:
  - Weekly insight generation via GitHub Actions
  - Standalone script for on-demand insight updates
affects: [content-updates, dashboard-freshness]

# Tech tracking
tech-stack:
  added: [tsx]
  patterns: [standalone-scripts, github-actions-scheduling]

key-files:
  created: [scripts/generate-insights.ts, .github/workflows/generate-insights.yml]
  modified: [package.json]

key-decisions:
  - "Used tsx to execute the standalone TypeScript script without a pre-build step, simplifying the GitHub Action."
  - "Configured weekly schedule (Mondays at 08:00 UTC) for insight generation to keep content fresh for the beginning of the week."
  - "Used upsert on fingerprint to avoid duplicate insights across multiple runs."

patterns-established:
  - "Scheduled data automation using GitHub Actions and standalone scripts."
  - "Secure secret injection via GitHub Secrets for automation-only Supabase Service Role access."

requirements-completed: [PROD-03]

# Metrics
duration: 15 min
completed: 2026-02-28
---

# Phase 15 Plan 03: Insights Automation Summary

**Automated weekly insight generation using a standalone script and a scheduled GitHub Action, ensuring fresh dashboard content without manual backend intervention.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-02-28T00:59:23Z
- **Completed:** 2026-02-28T01:14:23Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Implemented `scripts/generate-insights.ts` that fetches projects from USASpending and upserts generated insights to Supabase.
- Configured `.github/workflows/generate-insights.yml` to run the script every Monday at 08:00 UTC.
- Integrated `tsx` as a devDependency to streamline TypeScript script execution.

## Task Commits

Each task was committed atomically:

1. **Task 1: Setup script dependencies and generate insights** - `a603aea0` (feat)
2. **Task 2: Configure Scheduled GitHub Action** - `80d35fd6` (feat)

**Plan metadata:** `docs(15-03): complete insights automation plan`

## Files Created/Modified
- `scripts/generate-insights.ts` - Standalone script for data-driven insight generation.
- `.github/workflows/generate-insights.yml` - Scheduled workflow for weekly updates.
- `package.json` - Added `tsx` devDependency.

## Decisions Made
- Used `tsx` for script execution to avoid complex build configurations for a simple automation task.
- Chose Monday mornings for the schedule to align with the start of the typical work week for watchdog audiences.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

**External services require manual configuration.** See [15-USER-SETUP.md](./15-USER-SETUP.md) for:
- Environment variables to add (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- Dashboard configuration steps for GitHub Actions Secrets.

## Next Phase Readiness
- Insights automation is in place.
- Ready for final production hardening tasks (Plan 04).

---
*Phase: 15-production-hardening-automation*
*Completed: 2026-02-28*

## Self-Check: PASSED
- `scripts/generate-insights.ts` exists.
- `.github/workflows/generate-insights.yml` exists.
- `tsx` present in `package.json`.
- Task commits exist in history.
