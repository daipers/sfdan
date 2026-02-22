# Phase 9: User Setup Required

**Generated:** 2026-02-22
**Phase:** 09-stabilization-and-deployment-hardening
**Status:** Incomplete

Complete these items for the integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `SENTRY_DSN` | Sentry Project Settings → Client Keys (DSN) | `.env.local` |
| [ ] | `SENTRY_ENVIRONMENT` | Set to `staging`/`production` per environment | `.env.local` |

## Account Setup

- [ ] **Create Sentry project** (if needed)
  - URL: https://sentry.io/signup/
  - Skip if: Project already exists for this app

## Dashboard Configuration

- [ ] **Create warning and critical alert rules**
  - Location: Sentry → Alerts → Create Alert Rule
  - Set to: Error rate and failed request thresholds

- [ ] **Add Slack and email notification actions**
  - Location: Sentry → Alerts → Integrations/Actions
  - Set to: Team channels + on-call email list

- [ ] **Configure uptime monitor for /api/health**
  - Location: Sentry → Uptime Monitoring
  - Set to: `https://[your-domain]/api/health`

## Verification

After completing setup, verify with:

```bash
# Confirm env vars present
grep SENTRY .env.local

# Confirm health endpoint responds
curl -i https://[your-domain]/api/health
```

Expected results:
- `SENTRY_DSN` and `SENTRY_ENVIRONMENT` are set
- `/api/health` returns JSON with `status` and `checks`

---

**Once all items complete:** Mark status as "Complete" at top of file.
