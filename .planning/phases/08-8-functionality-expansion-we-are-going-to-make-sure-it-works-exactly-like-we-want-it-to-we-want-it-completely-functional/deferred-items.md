Deferred items discovered during 08-04 execution:

1. Content page uses sync access to `searchParams` and throws Next.js dynamic API error on `/content`.
   - Observed during: `npm run test:e2e`
   - Error: Route "/content" used `searchParams.q` without awaiting or `React.use()`

2. Analytics API logs JSON parse errors when request body is empty.
   - Observed during: `npm run test:e2e`
   - Error: `request.json()` failed with "Unexpected end of JSON input"

3. Supabase tables missing for analytics and content.
   - Observed during: `npm run test:e2e`
   - Errors: `public.analytics_events` and `public.content_posts` not found in schema cache
