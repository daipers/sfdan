# Phase 12: User Setup Required

**Generated:** 2026-02-25
**Phase:** 12-runtime-data-errors
**Status:** Incomplete

Complete these items for the integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

None required for this phase.

## Dashboard Configuration

- [ ] **Run Supabase schema updates for content posts**
  - Location: Supabase Dashboard -> SQL Editor
  - Set to: Run `supabase/schema.sql` to create `content_posts`
  - Notes: This enables content queries to resolve without fallback data.

## Verification

After completing setup, verify with:

```bash
npm run build:static
```

Expected results:
- Static export completes without missing-table warnings.

---

**Once all items complete:** Mark status as "Complete" at top of file.
