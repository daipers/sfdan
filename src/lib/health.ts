import { createClient } from "@supabase/supabase-js";

const HEALTH_TIMEOUT_MS = 3000;
const USASPENDING_HEALTH_URL =
  "https://api.usaspending.gov/api/v2/awards/last_updated/";

export type HealthCheckResult = {
  ok: boolean;
  latencyMs: number;
  error?: string;
};

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Health check timed out"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function checkSupabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      latencyMs: 0,
      error: "Supabase environment variables are missing",
    };
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    await withTimeout(
      supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
      HEALTH_TIMEOUT_MS
    );

    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: formatError(error),
    };
  }
}

export async function checkUsaspending(): Promise<HealthCheckResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(USASPENDING_HEALTH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        latencyMs: Date.now() - start,
        error: `USASpending responded ${response.status}`,
      };
    }

    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: formatError(error),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
