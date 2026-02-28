import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  
  // Inject mock Supabase session into localStorage
  await page.evaluate(() => {
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
    
    localStorage.setItem(storageKey, JSON.stringify(mockSession));
    localStorage.setItem('sb-auth-token', JSON.stringify(mockSession));
    localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
  });

  // Save storage state for other tests if needed
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
