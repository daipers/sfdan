# Codebase Concerns

**Analysis Date:** 2026-02-21

## Tech Debt

### Hardcoded Placeholder in Cache Configuration

- **Issue:** Cache initialization checks for placeholder value `'your_supabase_url_here'` instead of detecting unset environment variables properly
- **Files:** `src/lib/cache.ts` (line 11)
- **Impact:** Application will silently fall back to API-only mode without meaningful feedback
- **Fix approach:** Remove the hardcoded placeholder check - rely on null/undefined detection only

### Scoring Weight Inconsistency

- **Issue:** Self-assessment scoring uses different weights (40/35/25) than public award scoring (35/35/30)
- **Files:** `src/lib/self-assessment.ts` (lines 10-12), `src/lib/scoring.ts` (lines 7-10)
- **Impact:** Users receive inconsistent compliance ratings between self-assessment and public data analysis
- **Fix approach:** Align scoring weights across both modules for consistency

### Dead Code in Agency Stats

- **Issue:** Empty for-loop block in `calculateAgencyStats` function that does nothing
- **Files:** `src/lib/agency-stats.ts` (lines 78-81)
- **Impact:** Confusion for developers, minor code bloat
- **Fix approach:** Remove the dead code block (lines 78-81)

### Large Component File

- **Issue:** `AssessmentWizard.tsx` is 564 lines - difficult to maintain and test
- **Files:** `src/components/AssessmentWizard.tsx`
- **Impact:** Hard to navigate, extended cognitive load, potential merge conflicts
- **Fix approach:** Extract sub-components for each wizard step (BasicInfoStep, TimelineStep, CompetitionStep, FundingStep, ResultsStep)

## Known Bugs

### Magic Link API Route Missing Env Var Handling

- **Issue:** Non-null assertion on `SUPABASE_SERVICE_ROLE_KEY` will throw runtime error if not configured
- **Files:** `src/app/api/auth/magic-link/route.ts` (lines 9-10)
- **Trigger:** Deploying without `SUPABASE_SERVICE_ROLE_KEY` environment variable
- **Workaround:** Ensure environment variable is set in all deployments

### Client-Side Filtering After Server Pagination

- **Issue:** Search filters (query, state, category) are applied after server-side pagination, potentially returning inconsistent page sizes
- **Files:** `src/lib/api.ts` (lines 58-98)
- **Impact:** Users may see varying result counts when filtering, especially with small page sizes
- **Fix approach:** Move filtering to happen before pagination, or implement proper server-side filter support

## Security Considerations

### Client-Side Auth Returns No-Op on Missing Config

- **Issue:** Supabase client returns a no-op object when environment variables are missing, silently failing auth
- **Files:** `src/lib/supabase.ts` (lines 14-24), `src/lib/supabase-server.ts` (lines 9-24)
- **Current mitigation:** Console warnings are logged
- **Recommendations:** Add runtime checks that throw errors in development to catch misconfiguration early

### Service Role Key Access in API Route

- **Issue:** Magic link route creates admin client with service role key - if env var is undefined, will crash
- **Files:** `src/app/api/auth/magic-link/route.ts` (lines 8-18)
- **Current mitigation:** Code checks for key existence before using (line 53)
- **Recommendations:** Add early validation at startup time, not just runtime

## Performance Bottlenecks

### Client-Side Processing of Large Datasets

- **Issue:** Filtering, sorting, and scoring are done client-side after fetching from USASpending API
- **Files:** `src/lib/api.ts` (lines 58-130)
- **Cause:** USASpending API has limited filter support, requiring post-fetch processing
- **Improvement path:** Implement pagination at application level before sending to client; use cursor-based pagination for large exports

### No Pagination for Large Exports

- **Issue:** Export API fetches up to 500 records at once but comment indicates it doesn't handle pagination for larger exports
- **Files:** `src/app/api/export/route.ts` (line 32), comment at line 38-39
- **Impact:** Exports limited to ~500 records regardless of MAX_EXPORT_ROWS (10000)
- **Improvement path:** Implement proper pagination loop to fetch all matching records

### Cache Hash Function Quality

- **Issue:** Simple string-based hash function used for cache keys is not cryptographically sound
- **Files:** `src/lib/cache.ts` (lines 33-40)
- **Impact:** Potential hash collisions with different inputs; not a security issue but could cause incorrect cache hits
- **Improvement path:** Use proper hash function (e.g., crypto.hash) or JSON.stringify with unique keys

## Fragile Areas

### USASpending API Response Field Assumptions

- **Issue:** Code assumes specific field names from API responses without defensive checks
- **Files:** `src/lib/usaspending.ts` (throughout), `src/lib/api.ts` (lines 74-78)
- **Why fragile:** External API can change field names or add/remove fields without notice
- **Safe modification:** Add optional chaining (?.) throughout, provide default values
- **Test coverage:** No mock API responses in tests

### Scoring Engine Depends on String Keywords

- **Issue:** Scoring heavily relies on keyword matching in descriptions (infrastructure, competitive, etc.)
- **Files:** `src/lib/scoring.ts` (lines 62-76, 125-134)
- **Why fragile:** False positives/negatives based on text, case sensitivity issues
- **Safe modification:** Add case-insensitive matching, consider fuzzy matching for typos

## Dependencies at Risk

### Tremor Beta Version

- **Issue:** Using `@tremor/react": "^4.0.0-beta-tremor-v4.4"` - beta/canary version
- **Files:** `package.json` (line 18)
- **Risk:** API can change between minor versions without notice
- **Migration plan:** Monitor for stable v4 release, or pin exact version

### Next.js 16 (Canary)

- **Issue:** Using Next.js 16.x which appears to be a newer/canary version (`^16.1.6`)
- **Files:** `package.json` (line 21)
- **Risk:** Potential instability, fewer community resources
- **Migration plan:** Consider downgrading to stable Next.js 15.x for production

## Missing Critical Features

### No Rate Limiting on Client

- **Problem:** No client-side request throttling for USASpending API calls
- **Impact:** Users can trigger many requests quickly, hitting API rate limits

### No Offline Support

- **Problem:** No service worker or offline fallback for core functionality
- **Impact:** Application completely unusable without network

### No Input Sanitization in Export

- **Problem:** Export functions don't sanitize special characters in award descriptions before CSV/Excel
- **Impact:** Potential issues with Excel formula injection or malformed exports

## Test Coverage Gaps

### No Mock USASpending API

- **What's not tested:** API response handling, error cases, field mapping
- **Files:** `src/lib/usaspending.ts`, `src/lib/api.ts`
- **Risk:** API changes could break parsing without detection
- **Priority:** Medium

### Integration Tests Missing

- **What's not tested:** Full user flows (search -> filter -> export), auth flow end-to-end
- **Risk:** Broken user journeys won't be caught by unit tests
- **Priority:** High

### No Error Boundary Tests

- **What's not tested:** Component error handling, fallback UIs
- **Files:** `src/app/error.tsx`
- **Risk:** Errors in production won't have graceful fallbacks tested
- **Priority:** Low

---

*Concerns audit: 2026-02-21*
