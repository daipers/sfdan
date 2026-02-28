'use client'

// src/app/content/page.tsx
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { ContentCard } from '@/components/ContentCard'
import { ContentFilters } from '@/components/ContentFilters'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'

// Type matching API response
interface ContentApiResponse {
  id: string
  slug: string
  title: string
  summary: string | null
  sections: Record<string, unknown> | null
  insight_ids: string[] | null
  status: string
  is_gated: boolean
  data_sources: Record<string, unknown> | null
  published_at: string | null
  approved_at: string | null
  approved_by: string | null
  created_at: string | null
  updated_at: string | null
}

function getParamValue(value: string | string[] | null): string {
  if (!value) return ''
  return Array.isArray(value) ? value[0] : value
}

export default function ContentPage() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<ContentApiResponse[]>([])
  const [loading, setLoading] = useState(true)

  const query = getParamValue(searchParams.get('q'))
  const type = getParamValue(searchParams.get('type'))
  const agency = getParamValue(searchParams.get('agency'))
  const state = getParamValue(searchParams.get('state'))
  const dateFrom = getParamValue(searchParams.get('from'))
  const dateTo = getParamValue(searchParams.get('to'))
  const tag = getParamValue(searchParams.get('tag'))

  useEffect(() => {
    async function fetchContent() {
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (type) params.set('type', type)
        if (agency) params.set('agency', agency)
        if (state) params.set('state', state)
        if (dateFrom) params.set('from', dateFrom)
        if (dateTo) params.set('to', dateTo)
        if (tag) params.set('tag', tag)

        const res = await fetch(`/api/content?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setContent(data.content || [])
        }
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [query, type, agency, state, dateFrom, dateTo, tag])

  return (
    <main className="min-h-screen bg-gray-50">
      <AnalyticsTracker
        eventName="page_view"
        journey="content_library"
        step="list_view"
        source="content"
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
              Findings Library
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Data-driven findings on federal infrastructure funding
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Browse executive summaries, methodology notes, and data sources for the latest
              compliance insights. Subscribe to unlock full report details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/newsletter"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ContentFilters />
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : content.length > 0 ? (
              <div className="grid gap-6">
                {content.map((post) => (
                  <ContentCard key={post.id} content={post as never} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">
                  No content found. Try adjusting your filters or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
