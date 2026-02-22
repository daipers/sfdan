import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const redis = Redis.fromEnv();

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
  analytics: true,
  prefix: "sfdan-rate-limit",
});

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
