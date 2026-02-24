// src/app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createContentDraftFromInsight, getPublishedContent, type ContentFilters, type InsightRecord } from '@/lib/content'
import { isAdminEmail } from '@/lib/admin'

// Force static export for GitHub Pages compatibility
export const dynamic = "force-static";

function getAdminEmail(request: NextRequest, body: Record<string, unknown>) {
  const headerEmail = request.headers.get('x-admin-email')
  if (headerEmail) return headerEmail
  const bodyEmail = typeof body.adminEmail === 'string' ? body.adminEmail : null
  return bodyEmail
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const filters: ContentFilters = {
    query: searchParams.get('q') || undefined,
    type: searchParams.get('type') || undefined,
    agency: searchParams.get('agency') || undefined,
    state: searchParams.get('state') || undefined,
    dateFrom: searchParams.get('from') || undefined,
    dateTo: searchParams.get('to') || undefined,
    tag: searchParams.get('tag') || undefined,
  }

  const content = await getPublishedContent(filters)
  return NextResponse.json({ content })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const adminEmail = getAdminEmail(request, body)

    if (!isAdminEmail(adminEmail)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insightPayload = (body.insight || body) as InsightRecord
    if (!insightPayload || !insightPayload.title || !insightPayload.summary) {
      return NextResponse.json({ error: 'Invalid insight payload' }, { status: 400 })
    }

    const draft = await createContentDraftFromInsight(insightPayload)

    if (!draft) {
      return NextResponse.json({ error: 'Unable to create content draft' }, { status: 500 })
    }

    return NextResponse.json({ content: draft })
  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
