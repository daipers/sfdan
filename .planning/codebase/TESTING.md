# Testing Patterns

**Analysis Date:** 2026-02-21

## Test Framework

**Runner:**
- Vitest (config in `vitest.config.ts`)

**Assertion Library:**
- Vitest built-in `expect` in `src/lib/*.test.ts`

**Run Commands:**
```bash
npm run test              # Run all tests (Vitest)
npm run test:run          # Run all tests once
npm run test:e2e          # Run Playwright E2E tests
```

## Test File Organization

**Location:**
- Unit tests are co-located in `src/lib/` (`src/lib/scoring.test.ts`, `src/lib/export.test.ts`)
- E2E tests live in `tests/` (`tests/e2e.spec.ts`)

**Naming:**
- Unit tests: `.test.ts` suffix
- E2E tests: `.spec.ts` suffix

**Structure:**
```
src/lib/*.test.ts
tests/*.spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest'

describe('module', () => {
  describe('functionName', () => {
    it('should do something', () => {
      // arrange
      // act
      // assert
      expect(result).toBe(...)
    })
  })
})
```

**Patterns:**
- Arrange/Act/Assert inline within `it` blocks (e.g., `src/lib/scoring.test.ts`)
- Multiple nested `describe()` blocks for grouping
- Expectation style uses `toBe`, `toContain`, `toHaveLength`, `toEqual`

## Mocking

**Framework:**
- Vitest mocks via `vi.mock` in `src/test/setup.ts`

**Patterns:**
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))
```

**What to Mock:**
- Next.js navigation hooks in test setup (`src/test/setup.ts`)

**What NOT to Mock:**
- Core lib logic (scoring and export functions tested directly in `src/lib/*.test.ts`)

## Fixtures and Factories

**Test Data:**
```typescript
const award = {
  'Award ID': 'TEST-001',
  'Description': 'Highway construction project',
  'Award Amount': 5000000,
  awardTypeCode: 'B',
}
```

**Location:**
- Inline fixtures inside test files (`src/lib/scoring.test.ts`, `src/lib/export.test.ts`)

## Coverage

**Requirements:** None enforced

**View Coverage:** Not configured

## Test Types

**Unit Tests:**
- Pure function tests for scoring, exports, and aggregation (`src/lib/scoring.test.ts`, `src/lib/export.test.ts`, `src/lib/agency-stats.test.ts`)

**Integration Tests:**
- Not detected

**E2E Tests:**
- Playwright in `tests/e2e.spec.ts`

## Common Patterns

**Async Testing:**
```typescript
test('homepage loads without errors', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```

**Error Testing:**
```typescript
expect(result).toEqual([])
expect(result.total).toBeLessThan(70)
```

---

*Testing analysis: 2026-02-21*
