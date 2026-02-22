// src/components/ContentCard.tsx
import Link from 'next/link'
import type { ContentPost } from '@/lib/content'

interface ContentCardProps {
  content: ContentPost
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

export function ContentCard({ content }: ContentCardProps) {
  const sections = content.sections || {}
  const tags = sections.tags || []
  const metric = sections.dataHighlights?.[0]

  return (
    <Link
      href={`/content/${content.slug}`}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {sections.contentType || 'Insight'}
          </span>
        </div>
        {content.is_gated && (
          <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded">
            Newsletter Required
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
      {content.summary && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{content.summary}</p>
      )}

      {metric && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-500">Key Metric</p>
          <p className="text-sm font-semibold text-gray-900">
            {metric.label}: {metric.value}
          </p>
          {metric.note && <p className="text-xs text-gray-500 mt-1">{metric.note}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span>{formatDate(content.published_at)}</span>
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
