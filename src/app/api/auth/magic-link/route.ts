// src/app/api/auth/magic-link/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLink } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

// Initialize admin client for database operations
// Note: In production, use service_role key securely (e.g., via environment variable)
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Email validation regex
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, organization, role } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Send magic link
    const result = await sendMagicLink(email)
    
    if (!result.success) {
      // Don't expose specific errors for security
      console.error('Magic link error:', result.error)
      return NextResponse.json(
        { error: 'Failed to send magic link. Please try again.' },
        { status: 500 }
      )
    }

    // Try to save lead info (non-blocking - don't fail if this errors)
    // Only save if Supabase is configured
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = getSupabaseAdmin()
        await supabaseAdmin
          .from('leads')
          .upsert({
            email: email.toLowerCase().trim(),
            organization: organization || null,
            role: role || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email',
          })
      } catch (leadError) {
        // Log but don't fail the request
        console.warn('Could not save lead info:', leadError)
      }
    }

    // Return success - don't reveal if email exists
    return NextResponse.json({
      success: true,
      message: 'Check your email for the login link',
    })
  } catch (error) {
    console.error('Magic link API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
