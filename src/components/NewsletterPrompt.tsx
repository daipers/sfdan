// src/components/NewsletterPrompt.tsx
import Link from 'next/link'

interface NewsletterPromptProps {
  title?: string
  description?: string
}

export function NewsletterPrompt({
  title = 'Want weekly compliance insights?',
  description = 'Join the newsletter for new findings, risk signals, and data updates.',
}: NewsletterPromptProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
        <p className="text-sm text-blue-800 mt-1">{description}</p>
      </div>
      <Link
        href="/newsletter"
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
      >
        Subscribe
      </Link>
    </div>
  )
}
