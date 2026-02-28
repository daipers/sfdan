# External Integrations

**Analysis Date:** 2026-02-28

## APIs & External Services

**Federal Spending Data:**
- USASpending.gov API v2 - Primary data source for federal award data
  - Endpoint: `https://api.usaspending.gov/api/v2`
  - Implementation: `src/lib/usaspending.ts`
  - Auth: None (public API)
  - Usage: Fetches IIJA-related grants, loans, and cooperative agreements
  - Caching: Client-side in-memory or static data fallbacks

**Data Aggregation:**
- Agency Statistics - Calculated client-side from project data
  - Implementation: `src/lib/agency-stats.ts`
  - Client-side cache: In-memory

## Data Storage

**Database:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` environment variable
  - Client: `@supabase/supabase-js` for browser and automation
  - Schema: `supabase/schema.sql`
  - Tables:
    - `cached_awards` - API response caching
    - `sync_status` - Sync tracking
    - `leads` - Lead generation data
    - `newsletter_subscribers` - Newsletter data
    - `analytics_events` - Event tracking data
    - `insights` - Data-driven insights
    - `content_posts` - Blog/content library posts

**File Storage:**
- None (no file upload/storage features)

**Caching:**
- Client-side in-memory caching
- Browser local storage (optional)
- Database-level caching table for award data

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Magic link (passwordless) via email OTP
  - Client: `@supabase/supabase-js` with client-side session handling
  - Files: `src/lib/supabase.ts`, `src/app/auth/callback/page.tsx`
  - Auth routes: Client-side callback handler
  - Protected pages: `/content/[slug]` (gated reports)

**Lead Generation:**
- Email capture via magic link sign-in
- Stores leads in `leads` table with organization and role

## Monitoring & Observability

**Error Tracking:**
- Sentry
  - Client config: `sentry.client.config.ts`
  - Instrumentation hook: `src/instrumentation.ts`
  - Environment tags via `SENTRY_ENVIRONMENT`

**Logs:**
- Console logging via `console.error` and `console.warn`
- Browser developer console (production)
- GitHub Actions logs (automation/build)

**Uptime:**
- Health checks: Manual or external monitoring of static pages
- Dependency checks: Supabase + USASpending

**Analytics:**
- Custom events tracked in Supabase `analytics_events` table
  - Implementation: `src/lib/analytics.ts`

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
  - Configuration: Next.js static export (`output: 'export'`)
  - Output: Static HTML/JS/CSS

**CI Pipeline:**
- GitHub Actions
  - Configuration: `.github/workflows/deploy.yml`
  - Automation: `.github/workflows/generate-insights.yml`
  - Build command: `npm run build:static`
  - Node version: 20

**Environment:**
- Development: `.env.local` (not committed)
- Production: GitHub Repository Secrets

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous (public) key
- `SUPABASE_SERVICE_ROLE_KEY` - Build/automation Supabase service role key
- `NEXT_PUBLIC_SITE_URL` - Production URL for auth redirects
- `SENTRY_DSN` - Sentry project DSN
- `SENTRY_ENVIRONMENT` - Sentry environment tag

**Secrets location:**
- `.env.local` (local development)
- GitHub Repository Secrets (production)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Supabase Auth email redirects (magic link URLs)
- Supabase database operations (internal)

---

*Integration audit: 2026-02-28*
