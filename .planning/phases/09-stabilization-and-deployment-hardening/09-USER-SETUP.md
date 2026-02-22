# Phase 09: User Setup Required

**Generated:** 2026-02-22
**Phase:** 09-stabilization-and-deployment-hardening
**Status:** Incomplete

Complete these items for Netlify release hardening. These steps require dashboard access.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | (staging env vars) | Netlify -> Site settings -> Build & deploy -> Environment | Netlify (staging) |
| [ ] | (production env vars) | Netlify -> Site settings -> Build & deploy -> Environment | Netlify (production) |

## Dashboard Configuration

- [ ] **Create a staging environment with its own env vars**
  - Location: Netlify -> Site settings -> Build & deploy -> Environment
  - Notes: Ensure staging has isolated values from production

- [ ] **Require manual promotion for production deployments**
  - Location: Netlify -> Deploys -> Production deploys
  - Set to: Manual approval required before promotion

## Verification

After completing setup, verify in Netlify:

- Staging deploy uses staging env vars
- Production deploy requires manual promotion

---

**Once all items complete:** Mark status as "Complete" at top of file.
