# Phase 8: User Setup Required

**Generated:** 2026-02-22
**Phase:** 08-8-functionality-expansion-we-are-going-to-make-sure-it-works-exactly-like-we-want-it-to-we-want-it-completely-functional
**Status:** Incomplete

Complete these items for the analytics integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

None - uses the existing Supabase environment variables already configured for the project.

## Dashboard Configuration

- [ ] **Apply analytics_events table + policies**
  - Location: Supabase Dashboard → SQL Editor
  - Run: `supabase/schema.sql` updates that add `analytics_events` table, indexes, and policies

## Verification

After completing setup, verify with:

```bash
# Optional if Supabase CLI is linked
npx supabase db query "select count(*) from analytics_events;"
```

Expected results:
- Query returns a count without errors

---

**Once all items complete:** Mark status as "Complete" at top of file.
