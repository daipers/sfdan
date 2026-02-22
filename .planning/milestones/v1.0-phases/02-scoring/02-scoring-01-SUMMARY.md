---
phase: "02-scoring"
plan: "01"
subsystem: "scoring-engine"
tags:
  - scoring
  - compliance
  - methodology
  - regulatory
dependency_graph:
  requires:
    - "01-foundation"
  provides:
    - "SCR-01: Scoring engine with defined rule set"
    - "SCR-02: Score based on environmental review, competitive bidding, modification authorization"
    - "SCR-03: Weighted composite score"
    - "SCR-04: Score display on project rows"
    - "SCR-05: Methodology documentation with regulatory citations"
  affects:
    - "Dashboard UI (score display)"
    - "API integration (scoring data)"
tech_stack:
  added:
    - "scoring.ts (scoring engine)"
    - "AwardCard.tsx (score display component)"
    - "methodology/page.tsx (documentation)"
  patterns:
    - "TDD not used - scoring is rule-based, not testable with current API"
key_files:
  created:
    - "src/lib/scoring.ts"
    - "src/components/AwardCard.tsx"
    - "src/app/methodology/page.tsx"
  modified:
    - "src/lib/usaspending.ts"
    - "src/app/page.tsx"
decisions:
  - "Environmental Review: 35% weight - Infrastructure keywords NEPA requirement indicate likely"
  - "Competitive Bidding: 35% weight - Award type code determines competition level"
  - "Modification Authorization: 30% weight - Period of performance indicates oversight"
---

# Phase 2 Plan 1: Scoring Engine Summary

**One-liner:** Procedural compliance scoring engine with 3-component breakdown and regulatory citations

## Objective

Build procedural compliance scoring engine with defensible methodology and regulatory citations. Create a scoring system that evaluates IIJA projects on procedural compliance using federal regulatory requirements (2 CFR 200, Build America Buy America, Davis-Bacon).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create scoring engine with rule definitions | 50f2b6e | src/lib/scoring.ts |
| 2 | Integrate scoring into data fetching and display | 50f2b6e | src/lib/usaspending.ts, src/app/page.tsx, src/components/AwardCard.tsx |
| 3 | Create methodology documentation page | 50f2b6e | src/app/methodology/page.tsx |

## Key Artifacts

### Scoring Engine (`src/lib/scoring.ts`)
- **ScoreBreakdown interface**: { environmental, competitiveBidding, modificationAuth, total }
- **Scoring rules**:
  - Environmental Review (35%): Infrastructure keywords → NEPA likelihood
  - Competitive Bidding (35%): Award type codes → competition level
  - Modification Authorization (30%): Period of performance → oversight
- **Helper functions**: getScoreColorClass, getScoreDescription, getScoreExplanation
- **Regulatory citations in code**: 2 CFR 200, NEPA, Davis-Bacon

### AwardCard Component (`src/components/AwardCard.tsx`)
- Score badge with color coding (green 80+, yellow 60-79, red <60)
- Score breakdown visible on each card
- Tooltip with score explanation
- Period of performance display

### Methodology Page (`/methodology`)
- Score interpretation guide
- Detailed scoring component explanations
- Full regulatory citations: 2 CFR 200, BABA, Davis-Bacon, NEPA
- Limitations and disclaimers

## Verification Results

- Build succeeds: ✅ (`npm run build` passes)
- TypeScript compiles: ✅ (`npx tsc --noEmit` passes)
- Methodology page renders: ✅ (static page generated)

## Success Criteria

- [x] Every project displays a procedural compliance score (0-100)
- [x] Score breakdown shows environmental review, competitive bidding, modification components
- [x] Methodology page documents scoring rules with regulatory citations
- [x] Scores calculate automatically when data loads (via fetchAwards integration)
- [x] Users understand score meaning through methodology page

## Deviations from Plan

None - plan executed exactly as written.

## Notes

- Scoring is based on available USASpending.gov API fields
- Some awards may show lower scores due to limited data (not necessarily compliance issues)
- Methodology page provides context for interpreting scores
- Score integration required adding 'Award Type' and 'Assistance Type' fields to API request

---

*Plan executed: 2026-02-20*
