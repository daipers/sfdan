const REQUIRED_SERVER_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "SENTRY_DSN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

export function assertServerConfig() {
  const missing = REQUIRED_SERVER_ENV.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      [
        "Missing required server configuration:",
        ...missing.map(key => `- ${key}`),
      ].join("\n")
    );
  }
}
