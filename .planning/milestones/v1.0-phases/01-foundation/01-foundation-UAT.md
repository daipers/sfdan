# Phase 1 UAT - Foundation & Data Ingestion

**Phase:** 1 - Foundation & Data Ingestion  
**Date:** 2026-02-20  
**Status:** ✅ PASSED (with fixes applied)

---

## Test Summary

| Test | Status | Notes |
|------|--------|-------|
| Dev server starts | ✅ PASS | Runs on localhost:3000 |
| Page loads | ✅ PASS | Dashboard renders without errors |
| API connects | ✅ PASS | USASpending.gov API returns data |
| Data displays | ✅ PASS | Award cards show with real data |
| Data currency badge | ✅ PASS | Shows "Data as of Feb 20, 2026" |
| Build succeeds | ✅ PASS | `npm run build` completes |

---

## Issues Found & Fixed

### Issue 1: API Filter Format (FIXED)
**Severity:** High - Blocked all data retrieval  
**Problem:** USASpending API returned 400 error: "Unexpected field 'agency' in parameter filters|agencies"  
**Root Cause:** Using `agency: code` instead of `name: agency_name` in filter object  
**Fix:** Changed IIJA_AGENCY_CODES to IIJA_AGENCIES (names), updated filter to use `name` property

### Issue 2: API Field Names (FIXED)
**Severity:** High - Data showed as $0, "Untitled Award"  
**Problem:** Frontend used old field names (`award_id`, `award_description`, `total_obligation`)  
**Root Cause:** USASpending API v2 uses different field names (`Award ID`, `Description`, `Award Amount`)  
**Fix:** Updated page.tsx to use correct API field names

### Issue 3: Sort Parameter Format (FIXED)
**Severity:** Medium - API returned validation error  
**Problem:** Sort was sent as array of objects  
**Root Cause:** API expects `sort: fieldName` and `order: "desc"` as separate fields  
**Fix:** Updated usaspending.ts to use correct format

---

## Verification Commands

```bash
# Start dev server
npm run dev

# Test API directly
curl -X POST https://api.usaspending.gov/api/v2/search/spending_by_award/ \
  -H "Content-Type: application/json" \
  -d '{
    "filters": {
      "time_period": [{"start_date": "2021-11-15", "end_date": "2026-02-20"}],
      "agencies": [{"type": "funding", "tier": "toptier", "name": "Department of Transportation"}],
      "award_type_codes": ["A", "B", "C", "D"]
    },
    "pagination": {"page": 1, "count": 5},
    "fields": ["Award ID", "Description", "Recipient Name", "Award Amount"],
    "sort": "Award Amount",
    "order": "desc"
  }'

# Build project
npm run build
```

---

## Known Limitations

1. **API Warning:** The `assistance_type` filter is ignored when using `award_type_codes` - this is expected API behavior
2. **Supabase:** Not configured by default - app works in API-only mode
3. **Data Scope:** Currently returns Department of Energy awards by default (largest IIJA recipient)

---

## Next Steps

Phase 1 is now functional. Ready to proceed to:
- Phase 2: Scoring Engine (procedural compliance scoring)

---

*UAT executed by: GSD Executor*
