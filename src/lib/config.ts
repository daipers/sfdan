const REQUIRED_ENV = ["SENTRY_DSN"] as const;

export function assertServerConfig() {
  const missing = REQUIRED_ENV.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required server configuration: ${missing.join(", ")}`
    );
  }
}
