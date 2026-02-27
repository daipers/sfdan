# Phase 14: Supabase Integration - Research

**Researched:** 2026-02-27
**Domain:** Backend integration, database, authentication
**Confidence:** HIGH

## Summary

Phase 14 focuses on completing the Supabase integration to make the full backend functional. The schema.sql exists and environment variables are configured, but the database tables need to be created in Supabase and all features need E2E verification.

**Primary recommendation:** Run schema.sql in Supabase dashboard, verify environment variables, then test each feature end-to-end.

## Current State

### Environment Variables (from .env.local)
| Variable | Value | Status |
|----------|-------|--------|
| NEXT_PUBLIC_SUPABASE_URL | https://rzscfynyurvvruobeiyh.supabase.co | ✅ Set |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | sb_publishable_EN-3kwSfj8fdzJtQaLW2-g_v1BGkmfw | ✅ Set |
| SUPABASE_SERVICE_ROLE_KEY | sb_secret_zycfh5pg0PJ_KYWhoyGT-A_lo1cFZQC | ✅ Set |

### Database Schema (supabase/schema.sql)
Tables to create:
- `cached_awards` - USASpending API cache
- `sync_status` - Data sync tracking
- `leads` - Lead generation storage
- `content_posts` - Content management system
- `insights` - Automated insights
- `newsletter_subscribers` - Newsletter signups
- `analytics_events` - Event tracking

### Features Needing Verification
| Feature | Current State | Needs Test |
|---------|---------------|------------|
| Newsletter signup | Form exists | ✅ |
| Content posts | Fallback mode | ✅ |
| Analytics events | API exists | ✅ |
| Insights generation | Cron endpoint | ✅ |
| Lead capture | Email gate works | ✅ |
| Magic link auth | Endpoint exists | ✅ |

## Tasks Required

### Task 1: Run Schema in Supabase
**Action:** User runs supabase/schema.sql in Supabase SQL Editor
- Navigate to https://app.supabase.com
- Select project rzscfynyurvvruobeiyh
- Open SQL Editor
- Run schema.sql

### Task 2: Verify Environment Variables
**Action:** Check all required env vars are set in GitHub Secrets
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- (Service role key should NOT be exposed)

### Task 3: Feature Testing
Test each backend feature:
1. Newsletter signup → check newsletter_subscribers table
2. Content page load → check content_posts retrieval
3. Analytics event → check analytics_events table
4. Lead capture → check leads table

### Task 4: E2E Testing
- Run full test suite
- Manual verification of key flows

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Database | Custom PostgreSQL | Supabase managed |
| Auth | Custom auth | Supabase Auth |
| Real-time | WebSocket server | Supabase Realtime (if needed) |

## Common Pitfalls

### Pitfall 1: Service Role Key Exposure
**What goes wrong:** Service role key exposed to client allows bypass of RLS
**How to avoid:** Ensure SUPABASE_SERVICE_ROLE_KEY is only used server-side and not exposed via NEXT_PUBLIC_*

### Pitfall 2: RLS Blocking Inserts
**What goes wrong:** Row Level Security policies block inserts from client
**How to avoid:** Verify policies in schema.sql allow public inserts for leads, newsletter, analytics

### Pitfall 3: Missing Environment Variables in Production
**What goes wrong:** GitHub Pages build fails due to missing env vars
**How to avoid:** Verify all NEXT_PUBLIC_ vars are in GitHub Secrets

## Verification Commands

```bash
# Test Supabase connection
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -o /dev/null -w "%{http_code}"

# Run local dev with Supabase
npm run dev

# Run tests
npm test

# Run E2E tests
npx playwright test
```

## Sources

- Supabase Dashboard: https://app.supabase.com
- Project: rzscfynyurvvruobeiyh
- Schema: /Users/dstand/Documents/SFDAN/supabase/schema.sql
