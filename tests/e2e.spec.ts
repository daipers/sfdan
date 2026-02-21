import { test, expect } from '@playwright/test';

test.describe('SFDAN E2E Tests', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/SFDAN/);

    // Verify main content loads
    await expect(page.locator('h1')).toBeVisible();

    // Check for critical console errors (ignore network errors for API)
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('Failed to fetch') && !err.includes('net::')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('search input exists on homepage', async ({ page }) => {
    await page.goto('/');

    // Look for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="q"]');
    await expect(searchInput.first()).toBeVisible();
  });

  test('navigation to /assess works', async ({ page }) => {
    await page.goto('/');

    // Find and click an assess link (use first() since there may be multiple)
    const assessLink = page.getByRole('link', { name: /assess/i }).first();
    await expect(assessLink).toBeVisible();
    await assessLink.click();

    // Verify we're on the assess page
    await expect(page).toHaveURL(/\/assess/);
  });

  test('custom 404 page renders for invalid routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');

    // Verify 404 page content
    await expect(page.getByText("This page doesn't exist")).toBeVisible();
    await expect(page.getByText('Return to Dashboard')).toBeVisible();
  });

  test('methodology page loads', async ({ page }) => {
    await page.goto('/methodology');

    // Verify methodology page content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('faq page loads', async ({ page }) => {
    await page.goto('/faq');

    // Verify FAQ page loads
    await expect(page.locator('h1')).toBeVisible();
  });

  test('data-sources page loads', async ({ page }) => {
    await page.goto('/data-sources');

    // Verify data sources page loads
    await expect(page.locator('h1')).toBeVisible();
  });
});
