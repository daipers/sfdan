---
created: 2026-02-28T00:07:15.189Z
title: Fix E2E test self-assessment selector
area: testing
files:
  - tests/e2e.spec.ts:115
---

## Problem

E2E test "self-assessment results include lead capture" times out waiting for Project Name field. The test at line 115 uses:
```
await page.getByLabel('Project Name').fill('Test Infrastructure Upgrade');
```

But the form selector has likely changed (possibly renamed to different label or removed).

Error: `locator.fill: Test timeout of 30000ms exceeded.`

## Solution

Update the selector in tests/e2e.spec.ts to match current form field labels. May need to use:
- getByPlaceholder()
- getByRole() with text input
- or locator with CSS selector

Run `npx playwright test --grep "self-assessment"` to verify fix.
