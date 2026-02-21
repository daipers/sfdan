// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockSupabaseClient = any

// Client-side Supabase client for browser environments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return a no-op client if env vars aren't configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured')
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOtp: async () => ({ data: { user: null, session: null }, error: null }),
      },
    }
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Helper to get current session (client-side)
export async function getSession() {
  const supabase = createClient()
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (e) {
    console.error('Error getting session:', e)
    return null
  }
}

// Helper to sign out
export async function signOut() {
  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('Error signing out:', e)
    return false
  }
}
