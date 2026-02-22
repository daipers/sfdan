---
phase: 02-scoring
plan: 01
type: execute
wave: 1
depends_on: ["01-foundation"]
files_modified:
  - src/lib/scoring.ts
  - src/lib/usaspending.ts
  - src/app/page.tsx
  - src/components/AwardCard.tsx
  - src/app/methodology/page.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Every project displays a procedural compliance score (0-100)"
    - "Score breakdown shows environmental review, competitive bidding, and modification components"
    - "Methodology page documents scoring rules with regulatory citations"
    - "Scores calculate automatically when data loads"
  artifacts:
    - path: "src/lib/scoring.ts"
      provides: "Scoring engine with rule definitions"
      exports: ["calculateScore", "ScoreBreakdown", "ScoringRule"]
    - path: "src/app/methodology/page.tsx"
      provides: "Public methodology documentation"
      contains: "2 CFR 200", "Build America Buy America", "Davis-Bacon"
  key_links:
    - from: "src/lib/usaspending.ts"
      to: "src/lib/scoring.ts"
      via: "calculateScore() called after fetch"
      pattern: "calculateScore.*award"
    - from: "src/components/AwardCard.tsx"
      to: "src/lib/scoring.ts"
      via: "ScoreBreakdown type imported"
      pattern: "ScoreBreakdown.*score"
---

<objective>
Build procedural compliance scoring engine with defensible methodology and regulatory citations.

Purpose: Create a scoring system that evaluates IIJA projects on procedural compliance using federal regulatory requirements (2 CFR 200, Build America Buy America, Davis-Bacon). This is the core differentiator for the dashboard.

Output: Working scoring engine with UI integration and methodology documentation.
</objective>

<execution_context>
@./.planning/phases/01-foundation/01-foundation-SUMMARY.md
@./.planning/REQUIREMENTS.md (SCR-01 through SCR-05)
</execution_context>

<context>
@./.planning/PROJECT.md
@./.planning/STATE.md

## Scoring Requirements from REQUIREMENTS.md

- **SCR-01**: Implement scoring engine with defined rule set
- **SCR-02**: Score based on: environmental review timing, competitive bidding window, modification authorization
- **SCR-03**: Calculate weighted composite score per project
- **SCR-04**: Display score prominently on each project row
- **SCR-05**: Document scoring methodology with regulatory citations (2 CFR 200, Build America Buy America, Davis-Bacon)

## Regulatory Framework Research

**2 CFR Part 200** (Uniform Administrative Requirements):
- Post-award compliance requirements (Subpart D)
- Financial management, internal controls, procurement standards
- Property standards, reporting requirements
- 2024 revisions effective October 1, 2024

**Build America Buy America Act (BABA)**:
- Domestic content preference for infrastructure projects
- Applies to iron, steel, manufactured products, construction materials
- All manufacturing processes must occur in the US
- Effective for funds obligated after May 14, 2022

**Davis-Bacon Act**:
- Prevailing wage requirements for construction
- Applies to contracts over $2,000
- Weekly payment requirements, wage determinations
- Covers laborers and mechanics on "site of work"

## Phase 1 Context

- USASpending API integration already working (`src/lib/usaspending.ts`)
- Caching layer in place (`src/lib/cache.ts`)
- Award cards display on main page
- Data currency badge component exists

## Scoring Approach

Based on available USASpending.gov data fields:
1. **Environmental Review** (35% weight): Award has associated assistance listings that typically require NEPA review
2. **Competitive Bidding** (35% weight): Assistance type indicates competitive vs non-competitive
3. **Modification Authorization** (30% weight): Award type and period of performance indicate proper oversight

Each component scored 0-100, weighted average = composite score.
</context>

<tasks>

<task type="auto">
  <name>Create scoring engine with rule definitions</name>
  <files>src/lib/scoring.ts</files>
  <action>
Create `src/lib/scoring.ts` with:

1. **Type definitions**:
   - `ScoreBreakdown`: { environmental: number, competitiveBidding: number, modificationAuth: number, total: number }
   - `ScoringRule`: { name, weight, evaluate(award): number, citation }

2. **Scoring rules**:
   - Environmental review: Check if assistance type typically requires NEPA environmental review (grants for construction, infrastructure)
   - Competitive bidding: Check assistance type codes (A=Formula Grant, B=Project Grant indicate competitive; many direct allocations are non-competitive)
   - Modification authorization: Check period of performance, funding type indicators

3. **Main function**:
   - `calculateScore(award: Award): ScoreBreakdown`
   - Returns weighted composite (0-100 scale)
   - All scoring rules with regulatory citations in comments

Reference: USASpending data fields include `assistanceListingType`, `awardType`, `periodOfPerformance`
  </action>
  <verify>
Run `npx tsc --noEmit src/lib/scoring.ts` - should compile without errors</verify>
  <done>Scoring engine produces 0-100 scores with breakdown components</done>
</task>

<task type="auto">
  <name>Integrate scoring into data fetching and display</name>
  <files>src/lib/usaspending.ts, src/app/page.tsx, src/components/AwardCard.tsx</files>
  <action>
1. **Update usaspending.ts**:
   - Import `calculateScore` from `./scoring`
   - Modify `fetchAwards()` to call `calculateScore()` on each award before returning
   - Add `score` field to returned award objects

2. **Update AwardCard.tsx**:
   - Import `ScoreBreakdown` type
   - Add score display with color coding (green 80+, yellow 60-79, red <60)
   - Show score badge prominently
   - Add tooltip explaining score components

3. **Update page.tsx**:
   - Pass score data to AwardCard components
   - Ensure score displays on all award cards
  </action>
  <verify>
Run `npm run build` - should complete without TypeScript errors</verify>
  <done>All award cards display compliance score (0-100) with visual indicator</done>
</task>

<task type="auto">
  <name>Create methodology documentation page</name>
  <files>src/app/methodology/page.tsx</files>
  <action>
Create `src/app/methodology/page.tsx` with:

1. **Scoring methodology explanation**:
   - Overview of the three scoring components
   - Weighting rationale (equal emphasis on process, competition, oversight)

2. **Regulatory citations**:
   - 2 CFR 200.300-346 (Post-award requirements)
   - Build America Buy America Act (IIJA §70901-70952)
   - Davis-Bacon Act (40 U.S.C. §§3141-3148)

3. **Scoring rules detail**:
   - Environmental review: Which assistance types trigger NEPA review
   - Competitive bidding: How competitive vs non-competitive awards are identified
   - Modification authorization: Period of performance and funding indicators

4. **Score interpretation guide**:
   - What each score range means
   - Limitations of the scoring system
   - Disclaimer about data availability

Use clear headings, bullet points, and accessible language for non-legal audiences.
  </action>
  <verify>
Visit `/methodology` page renders without errors</verify>
  <done>Public methodology page accessible with regulatory citations</done>
</task>

</tasks>

<verification>
- Build succeeds: `npm run build` passes
- Scoring calculates: Awards display 0-100 scores
- Methodology accessible: `/methodology` loads with citations
- Score display: Color-coded badges visible on award cards
</verification>

<success_criteria>
1. Every project displays a procedural compliance score (0-100) ✓
2. Score breakdown shows environmental review, competitive bidding, modification components ✓
3. Methodology page documents scoring rules with regulatory citations ✓
4. Scores calculate automatically when data syncs (via fetchAwards integration) ✓
5. Users understand score meaning through methodology page ✓
</success_criteria>

<output>
After completion, create `.planning/phases/02-scoring/02-scoring-01-SUMMARY.md`
</output>
