# Phase 15: Production Hardening & Automation - Research

**Researched:** 2026-02-27
**Domain:** Production readiness, scheduled automation, static-host dynamics
**Confidence:** HIGH

## Summary

This phase focuses on transitioning dynamic features (Newsletter, Lead Capture, Analytics) from server-side `/api` routes to direct client-side Supabase interactions, ensuring they function correctly on static hosts like GitHub Pages. Additionally, it automates the "Insights" background task using GitHub Actions to maintain data freshness without a persistent backend server.

**Primary recommendation:** Use the Supabase Browser Client for all user-facing interactions (inserting leads, tracking events) protected by strict Row Level Security (RLS), and implement a client-side auth callback route to handle magic link redirects on the static host.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/ssr` | ^0.5.2 | Client-side Auth/DB | Official Next.js/Supabase integration for static & SSR |
| `tsx` | Latest | Standalone script execution | Fast, no-config TypeScript execution for GitHub Actions |
| `playwright` | ^1.58.2 | E2E Testing | Robust browser automation with session injection support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `gh-pages` | ^6.1.1 | Deployment | Standard for deploying static `out/` to GitHub Pages |

**Installation:**
```bash
npm install @supabase/ssr @supabase/supabase-js
npm install --save-dev tsx
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── auth/
│   │   └── callback/        # Client-side route for magic link processing
│   └── ...
├── scripts/                 # Standalone automation scripts
│   └── generate-insights.ts # Scheduled task for USASpending analysis
└── lib/
    ├── supabase.ts         # Browser client initialization
    ├── analytics.ts        # Client-side tracking logic
    └── ...
```

### Pattern 1: Client-Side Auth Callback
**What:** A dedicated client component that handles the redirect from Supabase Auth.
**When to use:** Required for static hosting (GitHub Pages) where `middleware.ts` cannot intercept requests.
**Example:**
```typescript
// src/app/auth/callback/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        // Redirect to original destination or dashboard
        router.push('/')
      }
    }
    handleAuth()
  }, [router, supabase.auth])

  return <div>Finishing sign-in...</div>
}
```

### Anti-Patterns to Avoid
- **Hard-coding Redirect URLs:** Always use environment variables or relative paths, and ensure they are whitelisted in Supabase Dashboard.
- **Service Role in Client:** NEVER use `SUPABASE_SERVICE_ROLE_KEY` in `src/app` or any client-side code. Use it only in `scripts/` or private GitHub Actions environments.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cron Scheduling | Custom server | GitHub Actions | Native to the host, free for public repos, reliable. |
| Auth Redirects | Custom hash parsing | `supabase.auth.getSession()` | Handles token exchange, refresh, and persistence automatically. |
| Mocking Auth | Custom mock clients | Playwright Storage State | Tests real client initialization with "baked-in" credentials. |

## Common Pitfalls

### Pitfall 1: RLS "Silent Failures"
**What goes wrong:** Client-side inserts return success or empty arrays, but data doesn't appear in the database.
**Why it happens:** RLS policies are missing or too restrictive (e.g., `INSERT` is allowed but `SELECT` is not, so the client can't confirm the write).
**How to avoid:** Specifically grant `INSERT` permissions to `anon` for tables like `analytics_events`.

### Pitfall 2: Magic Link Hash Fragments
**What goes wrong:** Users click a magic link but are not logged in because the hash fragment (`#access_token=...`) is lost on redirect.
**Why it happens:** Some static hosts or client-side routers might strip hash fragments before the Supabase client can read them.
**How to avoid:** Use the client-side callback pattern and ensure the `redirectTo` points to an actual `.html` file (or handled route) in the static export.

## Code Examples

### Standalone Insights Script (GitHub Action)
```typescript
// scripts/generate-insights.ts
import { createClient } from '@supabase/supabase-js'
import { fetchAwards } from '../src/lib/usaspending'
import { generateInsights } from '../src/lib/insights'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const awards = await fetchAwards({ pageSize: 100 })
  const insights = generateInsights(awards.results)
  
  for (const insight of insights) {
    await supabase.from('insights').upsert(insight, { onConflict: 'fingerprint' })
  }
}

main().catch(console.error)
```

### Playwright Auth Mocking
```typescript
// tests/auth-setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('sb-your-project-id-auth-token', JSON.stringify({
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      user: { email: 'test@example.com', id: 'mock-uuid' },
      expires_at: Math.floor(Date.now() / 1000) + 3600
    }));
  }, process.env.MOCK_AUTH_TOKEN);
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js API Routes | Direct Supabase Client | Static Hosting | Zero server cost, better scalability. |
| Server-side Cron | GitHub Actions Cron | Serverless/Static | Decouples background tasks from UI server. |

## Open Questions

1. **GitHub Pages URL Structure:** Will the magic link redirect work seamlessly with the `/repo-name/` subpath?
   - *Recommendation:* Use `window.location.origin + process.env.NEXT_PUBLIC_BASE_PATH` to construct redirect URLs.
2. **USASpending IP Blocking:** Does USASpending block common CI runners (GitHub Actions)?
   - *Recommendation:* Verify in a small test action. Usually, they have high limits for public data.

## Sources

### Primary (HIGH confidence)
- Supabase SSR Docs: [https://supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- GitHub Actions Scheduled Events: [https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

### Secondary (MEDIUM confidence)
- Playwright LocalStorage Auth: [https://playwright.dev/docs/auth](https://playwright.dev/docs/auth)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Core libraries are established.
- Architecture: HIGH - Callback pattern is standard for static auth.
- Pitfalls: MEDIUM - RLS and hash fragments are common friction points.

**Research date:** 2026-02-27
**Valid until:** 2026-05-27
