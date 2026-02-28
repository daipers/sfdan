# SFDAN - Procedural Integrity Score Dashboard

A Next.js application that tracks IIJA infrastructure funding and procedural compliance, now deployed on GitHub Pages with static export.

## 🚀 GitHub Pages Deployment

This project is configured for deployment to GitHub Pages with static export.

### Prerequisites

1. **Repository must be public** (GitHub Pages requirement for free hosting)
2. **GitHub Pages must be enabled** in repository settings
3. **Required environment variables must be configured** (see below)

### Environment Variables

Create a `.env.local` file with:

```bash
# GitHub Pages Configuration
NEXT_PUBLIC_PAGES_BASE_PATH="/sfdan"
STATIC_EXPORT=true

# Supabase Configuration (for client-side use)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Optional: Analytics and Monitoring
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_ENVIRONMENT="production"
SENTRY_AUTH_TOKEN=""

# Optional: Rate Limiting (client-side)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Optional: Insights Generation (client-side)
INSIGHTS_CRON_SECRET=""

# Optional: Admin Access (client-side validation)
ADMIN_EMAILS="admin@example.com,admin2@example.com"
```

### Local Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Static build (for GitHub Pages testing)
npm run build:static

# Test static build locally
npm run deploy:local
```

### Deployment

#### Automatic (GitHub Actions)

Pushes to `main` branch automatically deploy via GitHub Actions.

#### Manual (Local)

```bash
# Deploy to gh-pages branch
npm run deploy:gh-pages
```

## 🏗️ Static Export Architecture

The application uses Next.js static export (`output: 'export'`) which converts all pages to static HTML at build time.

#### Key Changes:

1. **Conditional Static Export**: Uses `STATIC_EXPORT=true` environment variable
2. **Base Path Configuration**: Automatically sets base path for GitHub Pages repository structure
3. **Asset Prefix**: Proper static asset loading with repository name
4. **Image Optimization**: Disabled for static export compatibility

### Client-Side API Replacements

Since GitHub Pages only serves static files, all API functionality has been converted to client-side:

| Original API | Client-Side Replacement | Location |
|--------------|------------------------|----------|
| `/api/agency-stats` | `getAgencyStatsClient()` | `src/lib/client-api.ts` |
| `/api/export` | `downloadCSV()` / `downloadExcel()` | `src/lib/client-export.ts` |
| `/api/insights/generate` | `generateInsightsClient()` | `src/lib/client-api.ts` |
| `/api/health` | `getHealthStatusClient()` | `src/lib/client-api.ts` |

### Data Flow Changes

1. **Dashboard Metrics**: Now calculates agency stats client-side from projects data
2. **Export Functionality**: Downloads files directly in browser using Blob API
3. **Content Pages**: Static generation with placeholder content
4. **Admin Pages**: Client-side authentication with static validation

## 📊 Features

### Core Functionality (Static Compatible)
- ✅ **Project Search & Filtering**: Client-side search with URL state management
- ✅ **Score Calculation**: Procedural integrity scoring with methodology
- ✅ **Data Export**: CSV/Excel export with browser download
- ✅ **Agency Comparison**: Client-side statistics calculation
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Analytics**: Client-side event tracking

### Limited Functionality (Static Constraints)
- ⚠️ **Real-time Data**: Requires build-time data availability
- ⚠️ **User Authentication**: Client-side only, no server sessions
- ⚠️ **Dynamic Content**: Static generation with build-time data
- ⚠️ **API Routes**: Return static responses, not functional
- ⚠️ **Database Operations**: Client-side Supabase only

## 🔧 Technical Details

### Build Process

```bash
# Static export build
npm run build:static

# Output directory
ls -la out/
```

### GitHub Actions Workflow

The deployment workflow (`/.github/workflows/deploy.yml`) automatically:
1. Installs dependencies with caching
2. Builds static site with environment variables
3. Uploads artifacts to GitHub Pages
4. Deploys to `https://[username].github.io/[repository-name]/`

### Environment Configuration

The workflow uses these GitHub Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

### Static Export Limitations

1. **No Server-Side APIs**: All functionality must be client-side
2. **No Dynamic Routes**: All routes must be pre-generated
3. **No Authentication**: Client-side validation only
4. **Build-Time Data**: Data must be available at build time
5. **No Real-Time Updates**: Static content until next build

## 🚀 Getting Started

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository settings (Settings > Pages > Source: GitHub Actions)
3. **Add required secrets** in repository settings (Settings > Secrets and variables > Actions)
4. **Push to main branch** to trigger automatic deployment
5. **Visit your site** at `https://[your-username].github.io/[repository-name]/`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (static responses)
│   ├── admin/             # Admin pages (client-side)
│   ├── content/           # Content pages (static)
│   ├── projects/          # Project detail pages (static)
│   └── page.tsx           # Home page (client-side)
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── client-api.ts      # Client-side API replacements
│   ├── client-export.ts   # Browser export functionality
│   ├── static-data.ts     # Static data utilities
│   └── agency-stats.ts    # Agency statistics calculation
└── public/                # Static assets
```

## 🔍 Development

### Local Development

```bash
npm run dev          # Start development server
npm run build:static # Test static build
npm run test         # Run tests
npm run lint         # Run linting
```

### Testing Static Export

```bash
# Build static site
npm run build:static

# Serve static files locally
npx serve out -p 3000

# Visit http://localhost:3000 to test
```

## 📈 Deployment Status

[![Deploy to GitHub Pages](https://github.com/[username]/[repository]/actions/workflows/deploy.yml/badge.svg)](https://github.com/[username]/[repository]/actions/workflows/deploy.yml)

---

**Status**: This project is fully configured for GitHub Pages with static export.
