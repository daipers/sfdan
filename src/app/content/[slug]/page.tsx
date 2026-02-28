// src/app/content/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContentBySlug } from '@/lib/content'
import { NewsletterPrompt } from '@/components/NewsletterPrompt'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { GatedContentWrapper } from '@/components/GatedContentWrapper'

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we need to pre-define possible slugs
  // Since content is dynamic, we'll use placeholder slugs
  return [
    { slug: 'sample-insight' },
    { slug: 'infrastructure-analysis' },
    { slug: 'compliance-report' }
  ];
}

function formatDate(dateString?: string | null) {
  if (!dateString) return 'Unpublished'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const content = await getContentBySlug(slug)

  if (!content) {
    notFound()
  }

  const sections = content.sections || {}

  return (
    <main className="min-h-screen bg-gray-50">
      <AnalyticsTracker
        eventName="page_view"
        journey="content_detail"
        step="view"
        source="content"
        metadata={{ gated: content.is_gated }}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/content" className="hover:text-blue-600">
            Findings
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{content.title}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
            {sections.contentType || 'Insight'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {content.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-3">
            <span>{formatDate(content.published_at)}</span>
            {content.is_gated && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                Newsletter Required
              </span>
            )}
          </div>
          {content.summary && (
            <p className="text-gray-600 mt-4 text-lg">{content.summary}</p>
          )}
        </header>

        <GatedContentWrapper isInitiallyGated={content.is_gated}>
          <div className="space-y-8">
            {sections.executiveSummary && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed">{sections.executiveSummary}</p>
              </section>
            )}

            {sections.keyFindings && sections.keyFindings.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Findings</h2>
                <ul className="space-y-3 text-gray-700">
                  {sections.keyFindings.map((finding: any, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <NewsletterPrompt />

            {sections.methodology && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Methodology</h2>
                <p className="text-gray-700 leading-relaxed">{sections.methodology}</p>
              </section>
            )}

            {sections.dataHighlights && sections.dataHighlights.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Highlights</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sections.dataHighlights.map((highlight: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-500">{highlight.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{highlight.value}</p>
                      {highlight.note && (
                        <p className="text-xs text-gray-500 mt-1">{highlight.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sections.citations && sections.citations.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Citations</h2>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  {sections.citations.map((citation: string, index: number) => (
                    <li key={index}>{citation}</li>
                  ))}
                </ul>
              </section>
            )}

            {sections.dataSources && sections.dataSources.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Sources</h2>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  {sections.dataSources.map((source: string, index: number) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </GatedContentWrapper>
      </div>
    </main>
  )
}
