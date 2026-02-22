// src/app/api/content/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getContentBySlug } from '@/lib/content'

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const content = await getContentBySlug(slug)

  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  return NextResponse.json({ content })
}
