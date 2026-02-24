import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const repoName = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: isStaticExport ? 'export' : undefined,
  basePath: isStaticExport ? repoName : '',
  assetPrefix: isStaticExport ? repoName : '',
  images: isStaticExport ? {
    loader: 'akamai',
    path: '',
  } : undefined,
  env: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

export default process.env.SENTRY_AUTH_TOKEN && !isStaticExport
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
