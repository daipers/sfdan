---
phase: 08-8-functionality-expansion-we-are-going-to-make-sure-it-works-exactly-like-we-want-it-to-we-want-it-completely-functional
plan: 02
subsystem: ui
tags: [lead-gen, cta, nextjs, supabase]

# Dependency graph
requires:
  - phase: 07-content-newsletter
    provides: Newsletter signup and gated reports flow
provides:
  - Lead capture CTA card for detail and assessment journeys
  - Content library CTA routes to newsletter signup
  - Functional report request actions
affects: [journey-analytics, lead-gen]

# Tech tracking
tech-stack:
  added: []
  patterns: [Reusable lead capture card with link or embedded form]

key-files:
  created: [src/components/LeadCaptureCard.tsx]
  modified:
    - src/app/projects/[id]/page.tsx
    - src/components/AssessmentWizard.tsx
    - src/app/content/page.tsx
    - src/app/gated-reports/page.tsx

key-decisions:
  - "Used a single LeadCaptureCard component with link or embedded EmailGateForm variants"

patterns-established:
  - "LeadCaptureCard is the primary CTA container for journey next steps"

requirements-completed: [HARD-01, HARD-03]

# Metrics
duration: 2 min
completed: 2026-02-22
---

# Phase 08 Plan 02: Journey Lead Capture CTAs + Report Polish Summary

**Reusable lead-capture CTA card added to detail and assessment results, with newsletter and report actions made fully navigable.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-22T04:16:27Z
- **Completed:** 2026-02-22T04:18:56Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added LeadCaptureCard component and wired it into project detail and assessment results flows
- Redirected content CTA to newsletter signup instead of gated reports
- Replaced inert report actions with functional request links

## Task Commits

Each task was committed atomically:

1. **Task 1: Add LeadCaptureCard and wire it into detail + assessment results** - `f5f402b7` (feat)
2. **Task 2: Fix newsletter CTA and remove dead actions in reports** - `7d884a70` (fix)

**Plan metadata:** TBD

## Files Created/Modified
- `src/components/LeadCaptureCard.tsx` - Reusable lead capture CTA with link or embedded form
- `src/app/projects/[id]/page.tsx` - Added lead capture CTA to project detail sidebar
- `src/components/AssessmentWizard.tsx` - Added lead capture CTA to assessment results
- `src/app/content/page.tsx` - Routed CTA to newsletter signup
- `src/app/gated-reports/page.tsx` - Made report actions functional and removed dead sign-in prompt

## Decisions Made
- Used a single LeadCaptureCard component with link or embedded EmailGateForm variants to keep CTA copy and styling consistent across journeys.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run lint` failed with: "Invalid project directory provided, no such directory: /Users/dstand/Documents/SFDAN/lint".

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Lead capture CTAs and report actions are wired; ready for 08-03 journey analytics instrumentation.
- Lint command should be investigated if required for CI.

---
*Phase: 08-8-functionality-expansion-we-are-going-to-make-sure-it-works-exactly-like-we-want-it-to-we-want-it-completely-functional*
*Completed: 2026-02-22*

## Self-Check: PASSED
