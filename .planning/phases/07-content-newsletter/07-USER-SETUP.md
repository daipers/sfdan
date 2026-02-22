# Phase 07: User Setup Required

**Generated:** 2026-02-22
**Phase:** 07-content-newsletter
**Status:** Incomplete

Complete these items for insights automation and newsletter signup to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | `.env.local` |
| [ ] | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API (anon public) | `.env.local` |
| [ ] | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (service_role) | `.env.local` |
| [ ] | `INSIGHTS_CRON_SECRET` | Generate a strong secret and add to Vercel Project → Settings → Environment Variables | `.env.local` and Vercel |

## Dashboard Configuration

- [ ] **Apply insights table SQL**
  - Location: Supabase Dashboard → SQL Editor
  - Set to: Run the insights table SQL from `supabase/schema.sql`
  - Notes: Required for insights storage and review status tracking

- [ ] **Apply newsletter subscribers table SQL**
  - Location: Supabase Dashboard → SQL Editor
  - Set to: Run the newsletter_subscribers table SQL from `supabase/schema.sql`
  - Notes: Required for newsletter signups and confirmation tracking

## Verification

After completing setup, verify with:

```bash
# Check env vars are set locally
grep SUPABASE .env.local
grep INSIGHTS_CRON_SECRET .env.local

# Generate insights (dev server must be running)
curl -X POST http://localhost:3000/api/insights/generate \
  -H "x-insights-secret: $INSIGHTS_CRON_SECRET"
```

Expected results:
- Env vars present in `.env.local`
- Insights generation returns created/skipped counts without errors

---

**Once all items complete:** Mark status as "Complete" at top of file.
