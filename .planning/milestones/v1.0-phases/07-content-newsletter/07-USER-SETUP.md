# Phase 7: User Setup Required

**Generated:** 2026-02-22
**Phase:** 07-content-newsletter
**Status:** Incomplete

Complete these items for the integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | `.env.local` |
| [ ] | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key | `.env.local` |
| [ ] | `ADMIN_EMAILS` | Comma-separated allowlist (admin review access) | `.env.local` |

## Dashboard Configuration

- [ ] **Apply content_posts table SQL**
  - Location: Supabase Dashboard → SQL Editor
  - Run: `supabase/schema.sql` (content_posts section)

## Verification

After completing setup, verify with:

```bash
# Build should succeed with Supabase configured
npm run build
```

Expected results:
- Build succeeds without Supabase configuration warnings

---

**Once all items complete:** Mark status as "Complete" at top of file.
