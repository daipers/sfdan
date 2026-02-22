// src/lib/admin.ts
import { createClient } from '@supabase/supabase-js'

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const allowlist = getAdminEmails()
  if (allowlist.length === 0) return false
  return allowlist.includes(email.trim().toLowerCase())
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase admin environment variables not configured')
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
