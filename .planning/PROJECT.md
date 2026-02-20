# Procedural Integrity Score Dashboard

## What This Is

A public web dashboard that applies PAE-style procedural compliance scoring to federal infrastructure projects funded by the Infrastructure Investment and Jobs Act (IIJA). Users can search projects by state, agency, and project type, view procedural timeline visualizations, and understand what each score means. The tool is designed for journalists, municipal finance officers, and inspector general community members.

## Core Value

Apply transparent, defensible procedural compliance scoring to IIJA federal infrastructure spending to help watchdog audiences identify potential issues and benchmark project integrity.

## Requirements

### Active

- [ ] IIJA project data integration via USASpending.gov API
- [ ] Procedural compliance scoring engine (timing rules, evidence requirements)
- [ ] Searchable dashboard (filter by state, agency, project type)
- [ ] Project timeline visualization showing procedural sequence
- [ ] Clear scoring methodology explanation for each project
- [ ] Email-gated detailed procedural audit reports
- [ ] Form-gated self-assessment tool (input own project data for private score)
- [ ] Content generation system for publishing data-driven findings

### Out of Scope

- Real-time alerting or monitoring — defer to v2
- Mobile app — web-first, mobile later
- OAuth login — email sufficient for lead gen gates

## Context

- **Data source**: USASpending.gov has well-documented API with IIJA spending data
- **Timeline**: 6-8 weeks for competent developer
- **Audience**: Government watchdog journalists, municipal finance officers, inspector general community
- **Lead generation**: Email-gated detailed reports + form-gated self-assessment tool
- **Content play**: Publish findings ("We analyzed X projects and found Y% had procedural timing violations")

## Constraints

- **Data**: Must use USASpending.gov public API — no proprietary data
- **Scoring**: Methodology must be defensible, based on actual regulatory requirements
- **Timeline**: 6-8 weeks — defined scope with finish line
- **Frontend**: Simple — searchable table, timeline visualization, clear explanations

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| USASpending.gov API | Well-documented, public, contains IIJA data | — Pending |
| Quick depth (3-5 phases) | 6-8 week timeline constraint | — Pending |
| YOLO mode | Auto-approve workflow, ship fast | — Pending |

---
*Last updated: 2026-02-20 after initialization*
