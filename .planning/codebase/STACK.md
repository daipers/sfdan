# Technology Stack

**Analysis Date:** 2026-02-28

## Languages

**Primary:**
- TypeScript 5.x - Full-stack type safety across client and server components
- JavaScript (ES2017) - Transpiled via Next.js/TypeScript compiler

**Secondary:**
- CSS (Tailwind CSS) - Utility-first styling

## Runtime

**Environment:**
- Node.js 20.x - Build environment
- Browser (React 19) - Client-side rendering (Static Export)
- GitHub Pages - Static hosting platform

**Package Manager:**
- npm - Package management
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Static export React framework with App Router
- React 19.0.0 - UI library with Server Components support (Build-time)

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.x - CSS transformation with autoprefixer

**Testing:**
- Vitest 4.0.18 - Unit and integration testing
- Playwright 1.58.2 - End-to-end browser testing
- Testing Library (React 16.3.2, Jest DOM 6.9.1) - Component testing utilities

**Build/Dev:**
- ESLint 9.x - JavaScript/TypeScript linting
- @typescript-eslint/eslint-plugin - TypeScript ESLint rules
- @typescript-eslint/parser - TypeScript ESLint parser
- TypeScript 5.x - Type checking and transpilation
- tsx - TypeScript execution engine for standalone scripts

## Key Dependencies

**Database & Auth:**
- @supabase/ssr 0.5.2 - Server-side Supabase utilities (used during build/automation)
- @supabase/supabase-js 2.97.0 - Supabase JavaScript client

**Data Visualization:**
- @tremor/react 4.0.0-beta-tremor-v4.4 - Dashboard components (React-based)
- recharts 3.7.0 - Composable charting library
- @tanstack/react-table 8.21.3 - Headless table/data grid

**State & Data:**
- nuqs 2.8.8 - URL search state management for Next.js
- date-fns 4.1.0 - Date manipulation utilities

**Export & Utilities:**
- xlsx 0.18.5 - Excel file generation for data export

**Observability:**
- @sentry/nextjs - Error tracking for client and build-time errors

**Reliability:**
- @upstash/ratelimit - Edge-friendly rate limiting utilities (client-side compatibility)
- @upstash/redis - Upstash Redis REST client for edge usage (client-side compatibility)

**Styling:**
- tailwindcss 3.4.1 - CSS framework
- autoprefixer 10.4.24 - CSS vendor prefixing

## Configuration

**Environment:**
- `.env.local` file present (contains secrets - not read)
- Key environment variables expected:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for build/automation
  - `NEXT_PUBLIC_SITE_URL` - Site URL for redirects
  - `SENTRY_DSN` - Sentry project DSN
  - `SENTRY_ENVIRONMENT` - Sentry environment tag (staging/production)
  - `UPSTASH_REDIS_REST_URL` - Upstash Redis REST endpoint for rate limiting
  - `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token for rate limiting

**Build:**
- `next.config.ts` - Next.js configuration (configured for static export)
- `tsconfig.json` - TypeScript config with path aliases (`@/*` → `./src/*`)
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS with tailwindcss and autoprefixer

**Testing:**
- `vitest.config.ts` - Vitest configuration with jsdom environment
- `playwright.config.ts` - Playwright e2e configuration

**Deployment:**
- GitHub Actions - CI/CD pipeline for static export and deployment to GitHub Pages

## Platform Requirements

**Development:**
- Node.js 20.x
- npm (comes with Node)
- Local Supabase instance or cloud project

**Production:**
- GitHub Pages - Static hosting
- Supabase cloud project (PostgreSQL + Auth)
- Environment variables configured in GitHub Repository Secrets

---

*Stack analysis: 2026-02-28*
