# Phase 12: Runtime Data Errors - Research

**Researched:** 2026-02-24
**Domain:** Next.js static export + external data integrations
**Confidence:** MEDIUM

## User Constraints

No CONTEXT.md found for this phase.

## Summary

Phase 12 is about making the static export resilient to external data failures while keeping runtime behavior correct. The current build errors indicate three failure classes: missing Supabase tables (`content_posts`), USASpending API validation errors (HTTP 422) for award searches, and static export incompatibilities with Route Handlers that depend on dynamic request data. These failures do not require new architecture; they require stricter request construction, graceful fallbacks, and static-safe handling of route handlers.

Next.js static export explicitly disallows dynamic request-dependent logic in Route Handlers. Route handlers can only generate static artifacts at build time; any access to dynamic request data must be avoided. The NextRequest API provides `nextUrl.searchParams` for parsing URL values but only safe in contexts that Next can pre-render. For GitHub Pages, this means API routes should either be fully static or replaced by client-side equivalents.

The USASpending integration already uses the `search/spending_by_award` endpoint. The error output shows a missing `award_type_codes` filter for award-by-id. Reusing the same filter shape used in the general search query (including `award_type_codes` and `assistance_type`) prevents 422 validation errors. Supabase errors are caused by missing tables rather than auth; the schema includes `content_posts`, so the build should fall back to a local stub if the table isn’t present or warn and return empty content.

**Primary recommendation:** Make static export defensive: ensure award-by-id filters match required USASpending filter shapes, return deterministic fallback content when Supabase tables are missing, and make Route Handlers static-safe by avoiding dynamic request fields in static builds.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
| --- | --- | --- | --- |
| Next.js | 16.1.6 | App Router + static export | Built-in static export support and Route Handler constraints | 
| React | 19.x | UI framework | Default for Next.js App Router |
| Supabase JS | 2.97.0 | Data storage + auth | Managed Postgres + Auth |

### Supporting
| Library | Version | Purpose | When to Use |
| --- | --- | --- | --- |
| @supabase/ssr | 0.5.2 | Server-side Supabase client | Server Components + auth flows |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
| --- | --- | --- |
| Static export Route Handlers | Client-side fetch + client-export utilities | Loses server-only export, works on GitHub Pages |

**Installation:**
```bash
npm install
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/              # App Router pages + route handlers
├── components/       # UI components
├── lib/              # External API clients + business logic
└── lib/content-*.ts  # Content fallbacks for static export
```

### Pattern 1: Static Export-Compatible Route Handlers
**What:** Route Handlers can only be static during `next build`. Avoid dynamic request data and use `nextUrl.searchParams` when needed.
**When to use:** Any `app/**/route.ts` used in static export or GitHub Pages.
**Example:**
```ts
// Source: https://nextjs.org/docs/app/api-reference/functions/next-request
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  return Response.json({ name })
}
```

### Pattern 2: Fallback Content for Missing Supabase Tables
**What:** Provide deterministic placeholder content for static export to avoid build-time failures when tables are not present.
**When to use:** Static export or local environments without Supabase schema applied.
**Example:**
```ts
// Source: repository pattern (supabase/schema.sql + content pages)
const fallbackPosts = [
  { slug: 'sample-insight', title: 'Sample Insight', status: 'published' }
]
```

### Anti-Patterns to Avoid
- **Dynamic request use in static Route Handlers:** Accessing `request.url` or cookies during static export can force runtime errors.
- **Hard failures on missing tables:** Throwing errors for missing Supabase tables prevents export; return fallback/empty data instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| Static export API responses | Custom build-time export scripts | Next.js static export + client-side API replacements | Leverages framework support and avoids brittle scripts |
| Supabase schema checks | Manual runtime schema validators | Supabase schema + fallbacks when missing | Keep runtime simple and predictable |

**Key insight:** Static export requires deterministic responses; fallbacks and client-side replacements are safer than custom export scripts.

## Common Pitfalls

### Pitfall 1: Dynamic request usage in Route Handlers
**What goes wrong:** Static export fails when Route Handlers read dynamic request values (e.g., `request.url`).
**Why it happens:** Static export disallows dynamic request data during `next build`.
**How to avoid:** Use static-safe handling or return a 501 JSON response that instructs client-side replacements.
**Warning signs:** `NEXT_STATIC_GEN_BAILOUT` errors in build logs.

### Pitfall 2: Missing `content_posts` table during build
**What goes wrong:** Supabase returns `PGRST205` and build fails or pages return 404.
**Why it happens:** Supabase schema not applied in the target project.
**How to avoid:** Apply `supabase/schema.sql` and add fallback content for static export.
**Warning signs:** `Could not find the table 'public.content_posts' in the schema cache`.

### Pitfall 3: USASpending 422 errors in award-by-id searches
**What goes wrong:** `search/spending_by_award` returns 422 with missing required filters.
**Why it happens:** Award-by-id payload omits required filter fields (e.g., `award_type_codes`).
**How to avoid:** Reuse the same filters as the general award search payload.
**Warning signs:** `Missing value: 'filters|award_type_codes' is a required field`.

## Code Examples

Verified patterns from official sources:

### Parse search params via `nextUrl`
```ts
// Source: https://nextjs.org/docs/app/api-reference/functions/next-request
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  return Response.json({ name })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| `next export` CLI | `output: 'export'` in Next config | v14+ | Static export is config-driven |

**Deprecated/outdated:**
- `next export` is deprecated in favor of `output: 'export'` (Next.js static export docs).

## Open Questions

1. **USASpending filter requirements for `search/spending_by_award`**
   - What we know: 422 error indicates `award_type_codes` is required when querying award-by-id.
   - What's unclear: Whether `assistance_type` or additional filters are required in all cases.
   - Recommendation: Validate against the live API or official filter docs before finalizing.

2. **Supabase schema in production**
   - What we know: `supabase/schema.sql` defines `content_posts`.
   - What's unclear: Whether the production Supabase project has been initialized.
   - Recommendation: Apply the schema and confirm table existence before relying on live data.

## Sources

### Primary (HIGH confidence)
- https://nextjs.org/docs/app/guides/static-exports - static export constraints and supported features
- https://nextjs.org/docs/app/api-reference/functions/next-request - `nextUrl.searchParams` usage

### Secondary (MEDIUM confidence)
- https://api.usaspending.gov/docs/endpoints - list of available API endpoints
- `supabase/schema.sql` - schema definitions for `content_posts`

### Tertiary (LOW confidence)
- Build logs from GitHub Pages (missing `award_type_codes`, `PGRST205` errors) - confirm with live API behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - confirmed from repo stack and Next.js docs
- Architecture: MEDIUM - based on Next.js static export constraints + current code
- Pitfalls: MEDIUM - based on build logs and error messages

**Research date:** 2026-02-24
**Valid until:** 2026-03-25
