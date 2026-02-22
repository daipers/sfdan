# Technology Stack

**Analysis Date:** 2026-02-21

## Languages

**Primary:**
- TypeScript 5.x - Full-stack type safety across client and server components
- JavaScript (ES2017) - Transpiled via Next.js/T TypeScript compiler

**Secondary:**
- CSS (Tailwind CSS) - Utility-first styling

## Runtime

**Environment:**
- Node.js 20.x - Server runtime (specified in `netlify.toml`)
- Browser (React 19) - Client-side rendering
- Edge (Next.js) - API route caching at edge

**Package Manager:**
- npm - Package management
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
- React 19.0.0 - UI library with Server Components support
- Node.js 20.x - Server runtime

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

## Key Dependencies

**Database & Auth:**
- @supabase/ssr 0.5.2 - Server-side Supabase utilities with cookie handling
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
- @sentry/nextjs - Error tracking for client, server, and edge runtimes

**Styling:**
- tailwindcss 3.4.1 - CSS framework
- autoprefixer 10.4.24 - CSS vendor prefixing

## Configuration

**Environment:**
- `.env.local` file present (contains secrets - not read)
- Key environment variables expected:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for server checks
  - `NEXT_PUBLIC_SITE_URL` - Site URL for redirects
  - `SENTRY_DSN` - Sentry project DSN
  - `SENTRY_ENVIRONMENT` - Sentry environment tag (staging/production)

**Build:**
- `next.config.ts` - Next.js configuration (minimal, mostly defaults)
- `tsconfig.json` - TypeScript config with path aliases (`@/*` → `./src/*`)
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS with tailwindcss and autoprefixer

**Testing:**
- `vitest.config.ts` - Vitest configuration with jsdom environment
- `playwright.config.ts` - Playwright e2e configuration

**Deployment:**
- `netlify.toml` - Netlify build configuration (Node 20, npm run build)

## Platform Requirements

**Development:**
- Node.js 20.x
- npm (comes with Node)
- Local Supabase instance or cloud project

**Production:**
- Netlify deployment
- Supabase cloud project (PostgreSQL + Auth)
- Environment variables configured in Netlify dashboard

---

*Stack analysis: 2026-02-21*
