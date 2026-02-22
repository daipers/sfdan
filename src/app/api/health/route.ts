import { checkSupabase, checkUsaspending } from "@/lib/health";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const [supabase, usaspending] = await Promise.all([
    checkSupabase(),
    checkUsaspending(),
  ]);

  const checks = {
    supabase,
    usaspending,
  };

  const ok = Object.values(checks).every(check => check.ok);
  const status = ok ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: ok ? 200 : 503,
    }
  );
}
