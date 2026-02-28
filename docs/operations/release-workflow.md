# Release Workflow (Blue/Green)

## Strategy

- **Blue (production):** Live site serving users.
- **Green (staging):** Pre-production environment for validation (e.g., GitHub Pages preview or secondary environment).

## Release Flow

1. **Deploy to staging (green).**
   - Trigger: merge to main or manual deploy to staging environment.
2. **Validate staging.**
   - Run smoke checks and confirm baseline UX.
   - Verify health: `GET /api/health` returns 200 (if applicable).
   - Check error signals: confirm no new critical Sentry alerts.
3. **Manual approval gate.**
   - Require explicit approval before promoting staging to production.
4. **Promote to production (blue).**
   - Promote the green deploy to production after approval.
5. **Health-gated auto-rollback.**
   - Post-promotion monitoring for stability.
   - On failure: trigger a rollback to the previous stable version.

## Health Gate Implementation

- Post-promotion monitoring hit `/api/health` (if applicable) or key pages every 30-60s for the first 10 minutes.
- If two consecutive checks fail, automatically rollback the production deploy.
- Record the rollback event in the incident log.

## Environment Configuration Checklist

Each environment has its own variables (e.g., in GitHub Actions secrets). **Do not store secrets in repo `.env` files.**

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

- Confirm health check failures (2 consecutive checks).
- Re-deploy the last known stable version via CI/CD.
- Validate health returns 200 (if applicable) after rollback.
- Log incident and follow-up actions.
