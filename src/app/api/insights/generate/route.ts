import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAwards } from '@/lib/usaspending'
import { generateInsights } from '@/lib/insights'

export const runtime = 'nodejs'
export const dynamic = "force-static"

const PAGE_SIZE = 100
const MAX_PAGES = 10

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

async function fetchAllAwards() {
  const allAwards: any[] = []
  let page = 1
  let total = 0
  let truncated = false

  while (page <= MAX_PAGES) {
    const result = await fetchAwards({ page, pageSize: PAGE_SIZE })
    allAwards.push(...(result.results || []))
    total = result.page_metadata?.total ?? allAwards.length

    if (allAwards.length >= total) {
      break
    }

    if (!result.results || result.results.length < PAGE_SIZE) {
      break
    }

    page += 1
  }

  if (allAwards.length < total) {
    truncated = true
  }

  return { awards: allAwards, total, truncated }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-insights-secret')
    if (!secret || secret !== process.env.INSIGHTS_CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured for insights' },
        { status: 500 }
      )
    }

    const { awards, total, truncated } = await fetchAllAwards()
    const drafts = generateInsights(awards)

    if (drafts.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: 0,
        totalAwards: total,
        truncated,
      })
    }

    const fingerprints = drafts.map(draft => draft.fingerprint)
    const { data: existing } = await supabaseAdmin
      .from('insights')
      .select('fingerprint')
      .in('fingerprint', fingerprints)

    const existingSet = new Set((existing || []).map(item => item.fingerprint))
    const toInsert = drafts.filter(draft => !existingSet.has(draft.fingerprint))

    if (toInsert.length > 0) {
      const { error } = await supabaseAdmin
        .from('insights')
        .insert(
          toInsert.map(draft => ({
            type: draft.type,
            title: draft.title,
            summary: draft.summary,
            metrics: draft.metrics,
            evidence: draft.evidence,
            trigger_type: draft.trigger_type,
            risk_level: draft.risk_level,
            status: 'pending_review',
            auto_publish_eligible: draft.risk_level === 'low',
            fingerprint: draft.fingerprint,
            period_start: draft.period_start ?? null,
            period_end: draft.period_end ?? null,
            generated_at: new Date().toISOString(),
          }))
        )

      if (error) {
        console.error('Insight insert error:', error)
        return NextResponse.json(
          { error: 'Failed to store insights' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      created: toInsert.length,
      skipped: drafts.length - toInsert.length,
      totalAwards: total,
      truncated,
    })
  } catch (error) {
    console.error('Insights generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
