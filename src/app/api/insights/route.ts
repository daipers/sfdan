import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = "force-static"

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function parseListParam(value: string | null): string[] | null {
  if (!value) return null
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured for insights' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const statusParam = parseListParam(searchParams.get('status'))
    const typeParam = parseListParam(searchParams.get('type'))
    const limitParam = Number(searchParams.get('limit') || DEFAULT_LIMIT)
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
      : DEFAULT_LIMIT

    const statuses = statusParam && statusParam.length > 0
      ? statusParam
      : ['published', 'approved']

    let query = supabaseAdmin
      .from('insights')
      .select('*')
      .in('status', statuses)
      .order('generated_at', { ascending: false })
      .limit(limit)

    if (typeParam && typeParam.length > 0) {
      query = query.in('type', typeParam)
    }

    const { data, error } = await query
    if (error) {
      console.error('Insights list error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch insights' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      count: data?.length || 0,
      results: data || [],
    })
  } catch (error) {
    console.error('Insights list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
