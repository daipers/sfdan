---
created: 2026-02-28T00:19:00.000Z
title: Fix Next.js 16 searchParams await error
area: ui
files:
  - src/app/content/page.tsx:18
---

## Problem

Next.js 16 breaking change: `searchParams` is now a Promise and must be awaited before accessing properties.

Error: `Route "/content" used searchParams.q. searchParams is a Promise and must be unwrapped with await or React.use() before accessing its properties.`

## Solution

Update src/app/content/page.tsx to await searchParams before using:
```tsx
const searchParams = await props.searchParams;
const query = getParamValue(searchParams.q);
```

Check other pages for similar issues.
