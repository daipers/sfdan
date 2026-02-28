// src/app/content/page.tsx
import Link from 'next/link'
import { getPublishedContent } from '@/lib/content'
import { ContentCard } from '@/components/ContentCard'
import { ContentFilters } from '@/components/ContentFilters'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'

function getParamValue(value?: string | string[]) {
  if (!value) return ''
  return Array.isArray(value) ? value[0] : value
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const query = getParamValue(resolved.q)
  const type = getParamValue(resolved.type)
  const agency = getParamValue(resolved.agency)
  const state = getParamValue(resolved.state)
  const dateFrom = getParamValue(resolved.from)
  const dateTo = getParamValue(resolved.to)
  const tag = getParamValue(resolved.tag)

  const content = await getPublishedContent({
    query: query || undefined,
    type: type || undefined,
    agency: agency || undefined,
    state: state || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    tag: tag || undefined,
  })

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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Newsletter Signup
            </Link>
            <Link
              href="/methodology"
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-white"
            >
              Methodology
            </Link>
          </div>
        </header>

        <div className="mb-6">
          <ContentFilters
            initialFilters={{
              query,
              type,
              agency,
              state,
              dateFrom,
              dateTo,
              tag,
            }}
          />
        </div>

        {content.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No findings yet</h2>
            <p className="text-gray-600">
              New insights publish weekly. Try adjusting filters or check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.map((post) => (
              <ContentCard key={post.id} content={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
