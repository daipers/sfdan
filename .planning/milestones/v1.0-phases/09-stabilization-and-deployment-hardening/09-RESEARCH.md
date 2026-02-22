# Phase 9: Stabilization and Deployment Hardening - Research

**Researched:** 2026-02-21
**Domain:** Deployment hardening, observability, and release workflows for Next.js on Vercel
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Release workflow
- Environments: staging + production
- Release cadence: on-demand (manual trigger)
- Approval gate: required before production
- Deployment strategy: blue/green

### Observability and alerts
- Primary signal: errors and failed requests
- Severity levels: two levels (warning/critical)
- Notification channels: email + Slack
- Incident response: immediate notifications

### Reliability safeguards
- Health checks: uptime + dependency checks (DB/API)
- Rollback: auto-rollback on failed health checks
- Incident handling: incident log + postmortem notes
- Rate limiting: per-IP limits

### Environment and config hardening
- Secrets: managed secret store (platform env/secret manager)
- Config validation: strict at startup (fail fast)
- Runtime environments: Node + Edge where possible
- Build protections: block deploy on failed tests

### Claude's Discretion
None specified.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

## Summary

Phase 9 should harden the existing Next.js + Vercel deployment with a staging-to-production promotion workflow, strict environment separation, and manual production promotion to implement the approval gate and blue/green-style traffic switching. Vercel supports staging via custom environments and production promotion via staged deployments and instant rollback, which map directly to the on-demand cadence, approval gate, and rollback requirements.

Observability should center on Sentry for error/failed request signals with alert rules and two severity levels, paired with uptime checks against a dedicated health endpoint. For deployment and environment hardening, Vercel environment variables and deployment protection settings provide managed secret storage and access control, while GitHub branch protection rules enforce test gates before production deploys.

**Primary recommendation:** Use Vercel custom environments + staged production promotion for blue/green-style releases, Sentry for error and uptime alerts, and GitHub protected branches for test gates before production promotion.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vercel Deployments | Current | Staging/production environments, manual promotion, rollbacks | Native to hosting platform; supports staging, manual promotion, and instant rollback workflows. |
| Vercel Environment Variables | Current | Managed secret store per environment | First-class secret/config management with environment scoping. |
| Sentry for Next.js (`@sentry/nextjs`) | Current | Error/failed request monitoring, alerting, uptime monitoring | Official SDK with Next.js-specific instrumentation and alerting. |
| GitHub Protected Branches | Current | Enforce required checks before merge/deploy | Enforces status checks and approvals before production changes. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vercel Drains | Current | Forward logs/traces to external observability | Use if centralized logs/traces are required beyond Sentry. |
| Vercel Deployment Protection | Current | Control access to preview/staging/production URLs | Use to restrict non-production deployments or protect sensitive environments. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sentry Alerts | Vercel Drains + external alerting | More setup; drains require Pro/Enterprise. |
| Vercel staged promotion | Custom blue/green infra | Higher complexity; Vercel already provides manual promotion and instant rollback. |

**Installation:**
```bash
npm install @sentry/nextjs
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/api/health/route.ts  # Uptime + dependency checks
├── lib/health/              # DB/API check helpers
├── lib/config/              # config schema + validation
└── instrumentation.ts       # Sentry registration for server/edge
```

### Pattern 1: Staging → Promote to Production (Blue/Green-style)
**What:** Deploy to staging (custom environment), validate health checks, then manually promote a staged production deployment to become “Current.”
**When to use:** Every release; satisfies approval gate and on-demand cadence.
**Example:** Vercel supports staging production deployments with manual promotion and instant rollback by reassigning domains to known-good deployments.
Source: https://vercel.com/docs/deployments/promoting-a-deployment

### Pattern 2: Environment-Scoped Secrets and Config
**What:** Use environment-scoped variables for staging vs production; pull dev env vars via Vercel CLI.
**When to use:** All secrets and config values (Supabase keys, API tokens, cron secrets).
**Example:** Vercel environment variables are scoped to Production/Preview/Custom/Development and encrypted at rest.
Source: https://vercel.com/docs/environment-variables

### Pattern 3: Centralized Error and Uptime Alerts
**What:** Use Sentry Next.js SDK for runtime errors and create alert rules for error rate/failure rate and uptime checks.
**When to use:** Always; required for error/failed request signals and immediate notifications.
**Example:** Sentry supports issue and metric alerts and uptime monitoring alerts.
Sources: https://docs.sentry.io/platforms/javascript/guides/nextjs/ , https://docs.sentry.io/product/alerts/

### Anti-Patterns to Avoid
- **Deploying directly to production without promotion:** Bypasses approval gate and increases rollback risk; use staged promotion.
- **Mixing staging/prod env vars:** Can cause data leaks or incorrect behavior; keep environment-scoped secrets strictly separated.
- **Using `NEXT_PUBLIC_VERCEL_URL` for internal fetches under deployment protection:** Protected URLs can block internal calls; use relative URLs instead.
Source: https://vercel.com/docs/deployment-protection

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error/failed request alerts | Custom logging + email scripts | Sentry Next.js SDK + alert rules | Official, end-to-end error tracking with alerting and stack traces. |
| Staging/prod promotion | Custom blue/green routing | Vercel staged production promotion | Built-in, fast promotion/rollback by reassigning domains. |
| Secret storage | `.env` in repo or ad-hoc secrets | Vercel Environment Variables | Encrypted, environment-scoped, deploy-time safe. |

**Key insight:** Deployment hardening is mostly configuration and operational workflow on Vercel/GitHub; custom implementations are slower and less reliable than platform features.

## Common Pitfalls

### Pitfall 1: Environment mismatch between staging and production
**What goes wrong:** Production deploys succeed but use staging keys or endpoints.
**Why it happens:** Environment variables are not scoped correctly or are copied manually.
**How to avoid:** Use Vercel environment scoping and avoid manual copying; use `vercel env pull` for local parity.
**Warning signs:** Different behavior between preview/staging and production with identical code.
Source: https://vercel.com/docs/environment-variables

### Pitfall 2: No fast rollback path
**What goes wrong:** Incident requires a rebuild to rollback, increasing downtime.
**Why it happens:** Auto-assignment of production domains remains on, no staged deployments.
**How to avoid:** Use staged production deployments and Instant Rollback to swap domains without rebuilds.
**Warning signs:** Rollback requires a full rebuild or re-deploy from main.
Source: https://vercel.com/docs/deployments/promoting-a-deployment

### Pitfall 3: Alerts configured without clear severity tiers
**What goes wrong:** Alert fatigue or missed critical events.
**Why it happens:** No warning vs critical thresholds.
**How to avoid:** Create two Sentry alert rules (warning/critical) for error and failure-rate metrics.
**Warning signs:** Frequent ignored alerts or no alerts during incidents.
Source: https://docs.sentry.io/product/alerts/

### Pitfall 4: Fetches break under Deployment Protection
**What goes wrong:** Internal fetches to `VERCEL_URL` fail once protection is enabled.
**Why it happens:** Protected URLs require authentication, breaking server/client requests.
**How to avoid:** Use relative URLs for internal fetches; derive origin from incoming request on server.
**Warning signs:** 401/403 responses from internal fetches after protection is enabled.
Source: https://vercel.com/docs/deployment-protection

## Code Examples

Verified patterns from official sources:

### Basic Route Handler for Health Checks
```ts
// Source: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function GET() {
  return Response.json({ status: "ok" })
}
```

### Route Segment Runtime Configuration (Node/Edge)
```ts
// Source: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export const runtime = "nodejs"
```

### Sentry Next.js SDK Initialization
```ts
// Source: https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "__PUBLIC_DSN__",
  tracesSampleRate: 0.1,
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Direct prod deploys from main | Staged production + manual promotion | Current Vercel workflow | Enables approval gates, safe rollbacks. |
| Ad-hoc logging | Sentry error + uptime alerts | Current Sentry product | Centralized error/failed request signals. |

**Deprecated/outdated:**
- Using generated deployment URLs (`VERCEL_URL`) for internal fetches when Deployment Protection is enabled.

## Open Questions

1. **Rate limiting implementation choice**
   - What we know: Requirement is per-IP limits; no existing rate limit library in repo.
   - What's unclear: Preferred service/library (Upstash, Vercel WAF, external API gateway).
   - Recommendation: Pick a managed rate limit service with an official Next.js/Vercel integration and document it before planning.

2. **Plan tier constraints (Vercel Pro/Enterprise)**
   - What we know: Custom environments and drains may require Pro/Enterprise.
   - What's unclear: Current Vercel plan and whether drains/custom environments are available.
   - Recommendation: Confirm plan tier early to avoid designing around unavailable features.

## Sources

### Primary (HIGH confidence)
- https://vercel.com/docs/deployments/environments - staging/preview/production environments
- https://vercel.com/docs/environment-variables - environment-scoped secrets
- https://vercel.com/docs/deployments/promoting-a-deployment - staged promotion and instant rollback flow
- https://vercel.com/docs/deployment-protection - deployment protection and fetch pitfalls
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers - route handlers and runtime config
- https://docs.sentry.io/platforms/javascript/guides/nextjs/ - Sentry SDK for Next.js
- https://docs.sentry.io/product/alerts/ - alert types and uptime monitoring
- https://vercel.com/docs/drains - drains for logs/traces
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches - required status checks and approvals

### Secondary (MEDIUM confidence)
- None

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Vercel/Sentry/GitHub are confirmed; rate limiting tool still open.
- Architecture: MEDIUM - Vercel promotion flow and Next.js runtime are confirmed, but plan-tier details unknown.
- Pitfalls: MEDIUM - Based on official docs; some operational details depend on team setup.

**Research date:** 2026-02-21
**Valid until:** 2026-03-21
