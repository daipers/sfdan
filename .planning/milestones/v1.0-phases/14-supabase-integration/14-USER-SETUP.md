# Phase 14: User Setup Required

**Generated:** 2026-02-27
**Phase:** 14-supabase-integration
**Status:** Incomplete

Complete these items for the integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Supabase Setup

- [ ] **Run schema.sql in Supabase SQL Editor**
  - Location: https://app.supabase.com/project/rzscfynyurvvruobeiyh → SQL Editor
  - Action: Copy supabase/schema.sql contents and run
  - Expected: 7 tables created (cached_awards, sync_status, leads, content_posts, insights, newsletter_subscribers, analytics_events)
  - Notes: This enables all backend features (newsletter, content, analytics, leads)

## GitHub Secrets Configuration

- [ ] **Verify GitHub Secrets contain required variables**
  - Location: GitHub repo → Settings → Secrets and variables → Actions
  - Required secrets:
    - `NEXT_PUBLIC_SUPABASE_URL` = https://rzscfynyurvvruobeiyh.supabase.co
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from .env.local)
  - Notes: Service role key should NOT be exposed (it's server-only)

## Verification

After completing setup, verify with:

```bash
# Run dev server and test
npm run dev

# In another terminal, test each feature:
# 1. Visit /newsletter and submit signup
# 2. Check Supabase dashboard → newsletter_subscribers table

# Run tests
npm test

# Run E2E tests
npx playwright test
```

Expected results:
- Dev server starts without errors
- Newsletter signup creates database row
- All tests pass
- E2E tests pass

---

**Once all items complete:** Mark status as "Complete" at top of this file.
