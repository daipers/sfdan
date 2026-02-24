// src/app/api/insights/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient, isAdminEmail } from '@/lib/admin'
import { createContentDraftFromInsight, publishContent } from '@/lib/content'

export const dynamic = "force-static"

function getAdminEmail(request: NextRequest, body: Record<string, unknown>) {
  const headerEmail = request.headers.get('x-admin-email')
  if (headerEmail) return headerEmail
  const bodyEmail = typeof body.adminEmail === 'string' ? body.adminEmail : null
  return bodyEmail
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const adminEmail = getAdminEmail(request, body)

    if (!isAdminEmail(adminEmail)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insightId = typeof body.id === 'string' ? body.id : null
    if (!insightId) {
      return NextResponse.json({ error: 'Insight id required' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data: insight, error } = await supabaseAdmin
      .from('insights')
      .select('*')
      .eq('id', insightId)
      .single()

    if (error || !insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const { error: updateError } = await supabaseAdmin
      .from('insights')
      .update({
        status: 'published',
        approved_at: now,
        published_at: now,
      })
      .eq('id', insightId)

    if (updateError) {
      console.error('Insight approval error:', updateError)
      return NextResponse.json({ error: 'Failed to approve insight' }, { status: 500 })
    }

    let content = null
    const { data: existingContent } = await supabaseAdmin
      .from('content_posts')
      .select('id')
      .contains('insight_ids', [insightId])
      .maybeSingle()

    if (existingContent?.id) {
      content = await publishContent(existingContent.id, adminEmail)
    } else {
      const draft = await createContentDraftFromInsight({
        id: insight.id,
        title: insight.title,
        summary: insight.summary,
        metrics: insight.metrics,
        evidence: insight.evidence,
        type: insight.type,
        risk_level: insight.risk_level,
        auto_publish_eligible: insight.auto_publish_eligible,
        generated_at: insight.generated_at,
      })
      if (draft) {
        content = await publishContent(draft.id, adminEmail)
      }
    }

    return NextResponse.json({ insightId, content })
  } catch (error) {
    console.error('Insights approval error:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
