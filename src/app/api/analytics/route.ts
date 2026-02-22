// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

function normalizeString(value: unknown) {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeToken(value: unknown) {
  const normalized = normalizeString(value)
  return normalized ? normalized.toLowerCase() : null
}

function normalizeMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  try {
    const serialized = JSON.stringify(value)
    if (serialized.length > 2000) {
      return null
    }
  } catch (error) {
    return null
  }

  return value as Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventName = normalizeToken(body?.eventName ?? body?.event_name)
    const journey = normalizeToken(body?.journey)
    const step = normalizeToken(body?.step)
    const source = normalizeToken(body?.source)
    const path = normalizeString(body?.path)
    const referrer = normalizeString(body?.referrer)
    const metadata = normalizeMetadata(body?.metadata)

    if (!eventName || !journey) {
      return NextResponse.json(
        { error: 'Event name and journey are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('Supabase environment variables not configured for analytics')
      return NextResponse.json(
        { accepted: true, warning: 'Analytics storage not configured' },
        { status: 202 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from('analytics_events').insert({
      event_name: eventName,
      journey,
      step,
      source,
      path,
      referrer,
      metadata,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json(
        { error: 'Failed to store analytics event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
