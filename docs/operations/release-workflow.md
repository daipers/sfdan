# Release Workflow (Blue/Green)

## Strategy

- **Blue (production):** Live site serving users.
- **Green (staging):** Pre-production environment for validation.

## Release Flow

1. **Deploy to staging (green).**
   - Trigger: merge to main or manual deploy to staging site.
2. **Validate staging.**
   - Run smoke checks and confirm baseline UX.
   - Verify health: `GET /api/health` returns 200.
   - Check error signals: confirm no new critical Sentry alerts.
3. **Manual approval gate.**
   - Require explicit approval before promoting staging to production.
4. **Promote to production (blue).**
   - Promote the green deploy to production after approval.
5. **Health-gated auto-rollback.**
   - Post-promotion monitor calls `GET /api/health` on a short interval.
   - On failure: trigger Netlify rollback via Deploys history or Netlify CLI/API.

## Health Gate Implementation

- Use a deployment hook or external monitor to call `/api/health` every 30-60s for the first 10 minutes post-promotion.
- If two consecutive checks fail, automatically rollback the production deploy in Netlify.
- Record the rollback event in the incident log.

## Environment Configuration Checklist

Each environment has its own variables in Netlify. **Do not store secrets in repo `.env` files.**

**Staging (green):**
- API base URL
- Supabase URL + anon key
- Sentry DSN
- Any feature flags required for pre-prod

**Production (blue):**
- API base URL
- Supabase URL + anon key
- Sentry DSN
- Any production-only feature flags

## Rollback Checklist

- Confirm `/api/health` failing (2 consecutive checks).
- Trigger Netlify rollback to last healthy production deploy.
- Validate `/api/health` returns 200 after rollback.
- Log incident and follow-up actions.
