import { test, expect } from '@playwright/test';

test.describe('Gated Content Journey', () => {
  test('anonymous user sees gate on gated report', async ({ page }) => {
    // Navigate to a gated report
    await page.goto('/content/compliance-report');
    
    // Verify title is visible
    await expect(page.locator('h1')).toContainText('Compliance Report');
    
    // Verify gate is shown
    await expect(page.locator('text=Subscribe to unlock the full report')).toBeVisible();
    await expect(page.locator('form input[type="email"]')).toBeVisible();
    
    // Verify full content is NOT visible
    await expect(page.locator('text=Executive Summary')).not.toBeVisible();
    await expect(page.locator('text=Key Findings')).not.toBeVisible();
  });

  test('authenticated user sees full content on gated report', async ({ page }) => {
    const projectId = 'rzscfynyurvvruobeiyh';
    const storageKey = `sb-${projectId}-auth-token`;
    const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE1MTYyMzkwMjJ9.signature';
    const mockSession = {
      access_token: mockJWT,
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: { 
        id: 'mock-user-id', 
        email: 'test@example.com',
        role: 'authenticated',
        aud: 'authenticated',
        app_metadata: { provider: 'email' },
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };

    // Inject before page loads
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key: storageKey, value: JSON.stringify(mockSession) });

    // Navigate directly to gated report
    await page.goto('/content/compliance-report');
    
    // Verify gate is NOT shown
    await expect(page.locator('text=Subscribe to unlock the full report')).not.toBeVisible();
    
    // Verify content is unlocked (may take a moment for re-hydration)
    await expect(page.locator('text=Executive Summary')).toBeVisible({ timeout: 10000 });
  });

  test('user is redirected back to report after auth callback', async ({ page }) => {
    // Navigate to the callback page with a redirect destination
    await page.goto('/auth/callback?redirectTo=/content/compliance-report');
    
    // Wait for redirect
    await page.waitForURL('**/content/compliance-report', { timeout: 10000 });
    
    // Verify we are on the right page
    expect(page.url()).toContain('/content/compliance-report');
  });
});
