// src/lib/auth.ts
/**
 * Authentication utilities using Supabase Auth
 */

import { createClient } from './supabase'
import { createServerSupabaseClient } from './supabase-server'

export interface LeadData {
  email: string
  organization?: string
  role?: string
}

/**
 * Send magic link to user's email
 * Uses Supabase Auth's passwordless sign-in
 */
export async function sendMagicLink(
  email: string,
  redirectPath: string = '/gated-reports'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectTo = `${baseUrl}${redirectPath}`
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  })

  if (error) {
    console.error('Error sending magic link:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Server-side function to send magic link
 */
export async function sendMagicLinkServer(
  email: string,
  redirectPath: string = '/gated-reports'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectTo = `${baseUrl}${redirectPath}`
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  })

  if (error) {
    console.error('Error sending magic link:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Save lead data to database
 * Note: This would be called from the API route after successful auth
 */
export async function saveLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('leads')
    .upsert({
      email: data.email,
      organization: data.organization || null,
      role: data.role || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'email',
    })

  if (error) {
    console.error('Error saving lead:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Check if user is authenticated (client-side)
 */
export async function checkAuth() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { authenticated: false, user: null }
  }
  
  return { authenticated: true, user }
}
