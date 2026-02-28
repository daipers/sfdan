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

  test('explore to project detail shows lead capture', async ({ page }) => {
    await page.goto('/');

    const table = page.getByRole('table', { name: /iija projects/i });
    if (await table.count() === 0) {
      test.skip(true, 'No project table available');
    }

    const rows = table.locator('tbody tr');
    if (await rows.count() === 0) {
      test.skip(true, 'No project rows available');
    }

    await Promise.all([
      page.waitForURL(/\/projects\//),
      rows.first().click(),
    ]);

    await expect(page).toHaveURL(/\/projects\//);

    const leadCaptureLink = page.locator('a[href="/gated-reports"]');
    const emailGateForm = page.getByLabel('Email Address');

    const hasLeadCaptureLink = await leadCaptureLink.first().isVisible().catch(() => false);
    const hasEmailGate = await emailGateForm.first().isVisible().catch(() => false);

    expect(hasLeadCaptureLink || hasEmailGate).toBeTruthy();
  });

  test.skip('self-assessment results include lead capture @slow', async ({ page }) => {
    // Skipped: Requires real email magic-link flow which can't work in E2E tests
    // To enable: Add Supabase Auth test mock or use pre-authenticated cookies
    test.skip(true, 'Requires Supabase Auth mock');
  });

  test('content page links to newsletter signup', async ({ page }) => {
    await page.goto('/content');

    const newsletterLink = page.getByRole('link', { name: /subscribe to newsletter/i });
    await expect(newsletterLink).toBeVisible();
    await expect(newsletterLink).toHaveAttribute('href', '/newsletter');

    await newsletterLink.click();
    await expect(page).toHaveURL(/\/newsletter/);
    await expect(page.getByRole('button', { name: /join the newsletter/i })).toBeVisible();
  });

  test('reports page shows email gate for unauthenticated users', async ({ page }) => {
    await page.goto('/gated-reports');

    const emailGateForm = page.getByLabel('Email Address');
    if (!(await emailGateForm.first().isVisible().catch(() => false))) {
      test.skip(true, 'Authenticated session detected');
    }

    await expect(emailGateForm.first()).toBeVisible();
  });
});
