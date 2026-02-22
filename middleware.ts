import { NextRequest, NextResponse } from "next/server";

import { getClientIp, isRateLimitingEnabled, rateLimit } from "@/lib/rate-limit";

const API_PREFIX = "/api";
const HEALTH_PATH = "/api/health";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(API_PREFIX) || pathname.startsWith(HEALTH_PATH)) {
    return NextResponse.next();
  }

  if (!isRateLimitingEnabled()) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  const result = await rateLimit!.limit(ip);
  const headers = new Headers();

  headers.set("X-RateLimit-Limit", String(result.limit));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(result.reset));

  if (!result.success) {
    const retryAfterSeconds = Math.max(
      0,
      Math.ceil((result.reset - Date.now()) / 1000)
    );

    headers.set("Retry-After", String(retryAfterSeconds));

    return NextResponse.json(
      { error: "Too many requests", retryAfter: retryAfterSeconds },
      { status: 429, headers }
    );
  }

  const response = NextResponse.next();
  headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
