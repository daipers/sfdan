# Procedural Integrity Score Dashboard

## What This Is

A public web dashboard that applies transparent, defensible procedural compliance scoring to federal infrastructure projects funded by the Infrastructure Investment and Jobs Act (IIJA). The application is built with Next.js and deployed as a static site on GitHub Pages, utilizing client-side Supabase integration for dynamic features like newsletter signups, lead capture, and automated insights.

## Core Value

Apply transparent, defensible procedural compliance scoring to IIJA federal infrastructure spending to help watchdog audiences identify potential issues and benchmark project integrity.

## Requirements

### Validated

- ✓ IIJA project data integration via USASpending.gov API — v1.0
- ✓ Procedural compliance scoring engine (timing rules, evidence requirements) — v1.0
- ✓ Searchable dashboard (filter by state, agency, project type) — v1.0
- ✓ Project detail view showing procedural breakdown — v1.0
- ✓ Clear scoring methodology explanation for each project — v1.0
- ✓ Email-gated detailed procedural audit reports — v1.0
- ✓ Form-gated self-assessment tool (input own project data for private score) — v1.0
- ✓ Content generation system for publishing data-driven findings — v1.0
- ✓ Automated insights generation via GitHub Actions — v1.0
- ✓ Production hardening for static hosting (GitHub Pages) — v1.0

### Active

- [ ] Interactive map view of projects by location
- [ ] Timeline visualization (Gantt-style) of project phases
- [ ] Automated finding alerts (e.g., "X% of projects have timing violations")
- [ ] Dark mode support

### Out of Scope

- Real-time alerting or monitoring — defer to v2
- Mobile app — web-first, mobile later
- OAuth login — email sufficient for lead gen gates

## Current State

- **Version**: v1.0 (Shipped 2026-02-28)
- **Architecture**: Next.js static export + Supabase client-side integration
- **Hosting**: GitHub Pages
- **Automation**: GitHub Actions for weekly insights and deployments
- **Lines of Code**: ~10,000 LOC TypeScript

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| USASpending.gov API | Well-documented, public, contains IIJA data | ✓ Good |
| GitHub Pages + Static Export | Cost-effective, simple hosting for watchdog tools | ✓ Good |
| Client-side Supabase | Enables dynamic features on static hosts without server-side routes | ✓ Good |
| Weekly Automation | Keeps content fresh via scheduled GitHub Actions | ✓ Good |
| YOLO mode | Auto-approve workflow, shipped MVP in 8 days | ✓ Good |

---
*Last updated: 2026-02-28 after v1.0 milestone completion*
