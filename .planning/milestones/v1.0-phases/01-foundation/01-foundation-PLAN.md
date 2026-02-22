---
phase: 01-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - next.config.ts
  - tailwind.config.ts
  - tsconfig.json
  - .env.local
  - supabase/schema.sql
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/lib/usaspending.ts
  - src/lib/cache.ts
  - src/components/DataCurrencyBadge.tsx
autonomous: true
user_setup:
  - service: supabase
    why: "Database for caching and lead storage"
    env_vars:
      - name: NEXT_PUBLIC_SUPABASE_URL
        source: "Supabase Dashboard -> Settings -> API"
      - name: NEXT_PUBLIC_SUPABASE_ANON_KEY
        source: "Supabase Dashboard -> Settings -> API"
must_haves:
  truths:
    - "Dashboard displays projects fetched from USASpending.gov API v2"
    - "Data refresh indicator shows 'Data as of [date]' to users"
    - "API rate limiting is handled gracefully (users don't see errors)"
    - "Cached data is used when API is unavailable or rate-limited"
    - "IIJA-specific awards are filtered correctly (by funding agency, assistance type)"
  artifacts:
    - path: "src/lib/usaspending.ts"
      provides: "API client for USASpending.gov v2"
      exports: ["fetchAwards", "fetchAwardDetails", "fetchLastUpdated"]
    - path: "src/lib/cache.ts"
      provides: "Caching layer for API responses"
      exports: ["getCached", "setCached", "invalidateCache"]
    - path: "supabase/schema.sql"
      provides: "Database schema for cached data"
      contains: "CREATE TABLE cached_awards"
    - path: "src/components/DataCurrencyBadge.tsx"
      provides: "Data currency indicator component"
      exports: ["DataCurrencyBadge"]
  key_links:
    - from: "src/lib/usaspending.ts"
      to: "https://api.usaspending.gov/api/v2/search/spending_by_award/"
      via: "fetch POST request"
      pattern: "fetch.*usaspending.*spending_by_award"
    - from: "src/lib/cache.ts"
      to: "supabase"
      via: "Supabase client"
      pattern: "supabase.*from.*cached"
    - from: "src/app/page.tsx"
      to: "src/lib/usaspending.ts"
      via: "Server Component data fetching"
      pattern: "await fetchAwards"
---

<objective>
Set up the foundation: Next.js project with USASpending.gov API integration and caching layer.

Purpose: Enable the dashboard to fetch and display IIJA infrastructure awards with reliable data currency and graceful rate limiting handling.

Output: Working Next.js app that fetches and displays USASpending.gov data with caching.
</objective>

<execution_context>
@./.opencode/get-shit-done/workflows/execute-plan.md
@./.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/research/STACK.md
@.planning/REQUIREMENTS.md

# Key context from research:
- USASpending.gov API v2 is free, no auth required
- Rate limit: ~5K requests/day
- Main endpoint: POST /api/v2/search/spending_by_award/
- Last updated endpoint: GET /api/v2/awards/last_updated
- Data updates monthly
</context>

<tasks>

<task type="auto">
  <name>Set up Next.js project with Supabase</name>
  <files>package.json, next.config.ts, tailwind.config.ts, tsconfig.json, .env.local, supabase/schema.sql, src/app/layout.tsx, src/app/page.tsx</files>
  <action>
    Initialize Next.js 15 project with TypeScript and Tailwind:
    - Run: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
    - Install dependencies: npm install @supabase/supabase-js @supabase/ssr date-fns
    
    Create supabase/schema.sql with:
    - Table: cached_awards (id, award_data JSONB, fetched_at TIMESTAMP, data_hash TEXT)
    - Table: sync_status (id, last_sync TIMESTAMP, status TEXT, record_count INTEGER)
    - Enable row-level security
    
    Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY placeholders
  </action>
  <verify>
    - npm run build succeeds
    - npm run dev starts without errors
    - Supabase client initializes
  </verify>
  <done>
    - Next.js project running at localhost:3000
    - Supabase client configured
    - Database schema created
  </done>
</task>

<task type="auto">
  <name>Implement USASpending.gov API integration</name>
  <files>src/lib/usaspending.ts, src/lib/cache.ts</files>
  <action>
    Create src/lib/usaspending.ts with:
    - fetchAwards(filters): POST to /api/v2/search/spending_by_award/
    - fetchAwardDetails(awardId): GET /api/v2/awards/{id}/
    - fetchLastUpdated(): GET /api/v2/awards/last_updated
    
    IIJA-specific filters (hardcoded defaults):
    - funding_agency codes for DOT, DOE, EPA, HUD, Agriculture
    - assistance_type for grants and loans
    - time_period from Nov 2021 (IIJA signed) to present
    
    Create src/lib/cache.ts with:
    - getCached(key): Check Supabase cache first
    - setCached(key, data, ttl): Store with TTL (default 1 hour for search, 24h for metadata)
    - Cache invalidation on API errors or rate limiting
    
    Handle rate limiting with exponential backoff (5 retries, starting at 1s)
  </action>
  <verify>
    - fetchAwards returns award data from API
    - Cached responses used on subsequent calls
    - Rate limiting triggers cache fallback
  </verify>
  <done>
    - API client fetches from USASpending.gov v2
    - Responses cached in Supabase
    - Graceful fallback when API unavailable
  </done>
</task>

<task type="auto">
  <name>Add data currency indicator and error handling</name>
  <files>src/components/DataCurrencyBadge.tsx, src/app/page.tsx</files>
  <action>
    Create src/components/DataCurrencyBadge.tsx:
    - Props: lastUpdated (Date | null), isLoading (boolean), error (string | null)
    - Display: "Data as of [date]" format: "MMM DD, YYYY"
    - Show loading spinner during fetch
    - Show error message if fetch fails
    
    Update src/app/page.tsx:
    - Fetch lastUpdated from API on mount
    - Display DataCurrencyBadge in header
    - Show sample award data in a simple card grid
    - Handle errors with user-friendly messages
    
    Add error boundaries for graceful degradation
  </action>
  <verify>
    - Data currency badge shows correct date
    - Loading state displays during fetch
    - Error message shows if API fails (without exposing raw errors to users)
  </verify>
  <done>
    - Users see "Data as of [date]" indicator
    - No raw API errors exposed to users
    - Loading states provide feedback
  </done>
</task>

</tasks>

<verification>
- [ ] Visit http://localhost:3000
- [ ] Page loads without errors
- [ ] Data currency badge displays in header
- [ ] Award data appears in cards (or empty state message)
- [ ] Check network tab: requests go to USASpending.gov API
- [ ] Second visit uses cached data (check Supabase)
</verification>

<success_criteria>
1. Dashboard displays projects fetched from USASpending.gov API v2
2. Data refresh indicator shows "Data as of [date]" to users
3. API rate limiting is handled gracefully (users don't see errors)
4. Cached data is used when API is unavailable or rate-limited
5. IIJA-specific awards are filtered correctly (by funding agency, assistance type)
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-SUMMARY.md`
</output>
