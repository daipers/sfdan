---
status: testing
phase: 12-runtime-data-errors
source: [12-01-SUMMARY.md]
started: 2026-02-25T08:00:20Z
updated: 2026-02-25T08:03:59Z
---

## Current Test

number: 2
name: Content fallback page renders
expected: |
  Visit `/content/sample-insight`. The page loads with the title "Sample Insight: Procurement Risk Signals"
  and its summary instead of a 500 error or empty state.
awaiting: user response

## Tests

### 1. Open award detail page
expected: From the dashboard, open any project/award detail page. The page renders award metadata without an error banner or blank state, and there is no "Failed to load award" message.
result: issue
reported: "https://daipers.github.io/projects/DEAC3243AL00036 404

There isn't a GitHub Pages site here.

If you're trying to publish one, read the full documentation to learn how to set up GitHub Pages for your repository, organization, or user account.

GitHub Status — @githubstatus"
severity: blocker

### 2. Content fallback page renders
expected: Visit `/content/sample-insight`. The page loads with the title "Sample Insight: Procurement Risk Signals" and its summary instead of a 500 error or empty state.
result: [pending]

### 3. Insights API guarded in static export
expected: Request `/api/insights` on the static-export deployment. The response is JSON with a 501 status and a message indicating static export is enabled (not a 500 error).
result: [pending]

### 4. Export API guarded in static export
expected: Request `/api/export?format=csv` on the static-export deployment. The response is JSON with a 501 status and a message indicating static export is enabled (not a 500 error).
result: [pending]

## Summary

total: 4
passed: 0
issues: 1
pending: 3
skipped: 0

## Gaps

- truth: "Award detail pages render without a 404 in the deployed static site"
  status: failed
  reason: "User reported: https://daipers.github.io/projects/DEAC3243AL00036 404\n\nThere isn't a GitHub Pages site here.\n\nIf you're trying to publish one, read the full documentation to learn how to set up GitHub Pages for your repository, organization, or user account.\n\nGitHub Status — @githubstatus"
  severity: blocker
  test: 1
  artifacts: []
  missing: []
