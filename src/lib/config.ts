const REQUIRED_SERVER_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const SITE_URL_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "SITE_URL",
] as const;

function resolveSiteUrl() {
  return SITE_URL_ENV_KEYS.map(key => process.env[key]).find(Boolean);
}

export function assertServerConfig() {
  const missing: string[] = REQUIRED_SERVER_ENV.filter(key => !process.env[key]);
  const resolvedSiteUrl = resolveSiteUrl();

  if (!process.env.NEXT_PUBLIC_SITE_URL && resolvedSiteUrl) {
    process.env.NEXT_PUBLIC_SITE_URL = resolvedSiteUrl;
  }

  if (!resolvedSiteUrl) {
    missing.push("NEXT_PUBLIC_SITE_URL");
  }

  if (missing.length > 0) {
    throw new Error(
      [
        "Missing required server configuration:",
        ...missing.map(key => `- ${key}`),
      ].join("\n")
    );
  }
}
