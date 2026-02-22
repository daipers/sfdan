# Phase 7: Content & Newsletter - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a content generation system for publishing data-driven findings, including newsletter signup, automated insights generation, and publishable content pages. Creation of new product capabilities beyond content distribution is out of scope.

</domain>

<decisions>
## Implementation Decisions

### Automated insights triggers
- Use both cadence and threshold-based triggers
- Thresholds can publish immediately; cadence acts as fallback

### Eligible insight types
- Integrity score anomalies (high/low outliers)
- Spending concentration (top agencies/states)
- Change over time (month-over-month shifts)

### Insights review policy
- Insights require review before publish

### Newsletter signup placement
- Dedicated newsletter page plus inline prompts on content pages
- Footer link as secondary entry

### Newsletter form fields
- Collect email, organization, role, and interests (topics)

### Signup gating
- Newsletter signup required for access to gated content

### Signup confirmation
- Inline success state (stay on page)

### Content page structure
- Executive summary -> key findings -> methodology -> data table/chart

### Data attribution
- Both inline citations and a Data Sources section

### Content update cadence
- Hybrid: periodic refresh with ad-hoc updates

### Content discovery
- Searchable library (index + filters)

### Editorial approval
- Single admin approval required before publish

### Auto-publish policy
- Auto-publish only low-risk category: pure descriptive stats (no interpretation)
- Aggregated rankings require approval

### Publish timing
- Publish immediately after approval

### Claude's Discretion
- Exact cadence interval for periodic refresh
- UI copy for signup prompts and confirmation
- Default sort order and filter design for the content library

</decisions>

<specifics>
## Specific Ideas

- Keep Phase 7 user experience coherent across signup, insights, and content pages

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 07-content-newsletter*
*Context gathered: 2026-02-21*
