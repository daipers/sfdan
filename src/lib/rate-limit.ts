import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const hasUpstashEnv =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstashEnv ? Redis.fromEnv() : null;

export const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "1 m"),
      analytics: true,
      prefix: "sfdan-rate-limit",
    })
  : null;

export function isRateLimitingEnabled() {
  return rateLimit !== null;
}

export function getClientIp(request: NextRequest) {
  const forwardedFor =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");

  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) {
      return ip;
    }
  }

  return "unknown";
}
