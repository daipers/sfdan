// src/app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendMagicLinkServer } from '@/lib/auth'

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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, organization, role, interests } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const normalizedInterests = Array.isArray(interests)
      ? interests.map((interest) => String(interest).trim()).filter(Boolean)
      : []

    const magicLinkResult = await sendMagicLinkServer(normalizedEmail, '/newsletter')

    if (!magicLinkResult.success) {
      console.error('Newsletter magic link error:', magicLinkResult.error)
      return NextResponse.json(
        { error: 'Failed to send confirmation link. Please try again.' },
        { status: 500 }
      )
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = getSupabaseAdmin()
        await supabaseAdmin
          .from('newsletter_subscribers')
          .upsert(
            {
              email: normalizedEmail,
              organization: organization ? String(organization).trim() : null,
              role: role ? String(role).trim() : null,
              interests: normalizedInterests,
              status: 'pending',
              source: 'newsletter',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          )
      } catch (dbError) {
        console.warn('Could not save newsletter subscriber:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks for signing up. Check your inbox for a confirmation link.',
    })
  } catch (error) {
    console.error('Newsletter subscribe API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
