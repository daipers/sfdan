# External Integrations

**Analysis Date:** 2026-02-21

## APIs & External Services

**Federal Spending Data:**
- USASpending.gov API v2 - Primary data source for federal award data
  - Endpoint: `https://api.usaspending.gov/api/v2`
  - Implementation: `src/lib/usaspending.ts`
  - Auth: None (public API)
  - Usage: Fetches IIJA-related grants, loans, and cooperative agreements
  - Caching: 1-hour ISR cache via Next.js `next: { revalidate: 3600 }`
  - Filters applied: 
    - IIJA agencies (DOT, DOE, EPA, HUD, USDA)
    - Assistance types: Grants (3), Cooperative Agreements (4), Loans (5)
    - Award type codes: A, B, C, D

**Data Aggregation:**
- Agency Statistics API - Custom endpoint for dashboard charts
  - Location: `src/app/api/agency-stats/route.ts`
  - Fetches 500 awards and aggregates by funding agency
  - Client-side cache: 1 hour in-memory

## Data Storage

**Database:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` environment variable
  - Client: `@supabase/supabase-js` with `@supabase/ssr` for server-side
  - Schema: `supabase/schema.sql`
  - Tables:
    - `cached_awards` - API response caching
    - `sync_status` - Sync tracking
    - `leads` - Lead generation data

**File Storage:**
- None (no file upload/storage features)

**Caching:**
- In-memory caching for API routes (agency-stats)
- Next.js ISR (Incremental Static Regeneration) for API responses
- Database-level caching table for award data

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Magic link (passwordless) via email OTP
  - Client: `@supabase/ssr` with cookie-based session handling
  - Files: `src/lib/supabase.ts`, `src/lib/supabase-server.ts`, `src/lib/auth.ts`
  - Auth routes: `src/app/api/auth/magic-link/route.ts`
  - Protected pages: `/gated-reports` (requires authentication)

**Lead Generation:**
- Email capture via magic link sign-in
- Stores leads in `leads` table with organization and role

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Bugsnag, or similar)

**Logs:**
- Console logging via `console.error` and `console.warn`
- Server-side: Next.js server logs
- Deployment: Netlify function logs

**Analytics:**
- Not detected in codebase

## CI/CD & Deployment

**Hosting:**
- Netlify
  - Configuration: `netlify.toml`
  - Build command: `npm run build`
  - Node version: 20
  - Output: Next.js static/lambda hybrid

**CI Pipeline:**
- Not explicitly configured (uses Netlify defaults)
- Playwright tests can run in CI with `test:e2e` npm script

**Environment:**
- Development: `.env.local` (not committed)
- Production: Netlify environment variables

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous (public) key
- `NEXT_PUBLIC_SITE_URL` - Production URL for auth redirects (optional, defaults to localhost)

**Secrets location:**
- `.env.local` (local development)
- Netlify dashboard Environment Variables section

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Supabase Auth email redirects (magic link URLs)
- Supabase database operations (internal)

---

*Integration audit: 2026-02-21*
