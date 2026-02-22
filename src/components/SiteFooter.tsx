// src/components/SiteFooter.tsx
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">SFDAN</h2>
            <p className="text-sm text-gray-600 mt-2">
              Federal funding accountability and compliance insights.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/content" className="hover:text-blue-600">
                  Findings Library
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="hover:text-blue-600">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/assess" className="hover:text-blue-600">
                  Self-Assessment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/methodology" className="hover:text-blue-600">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="hover:text-blue-600">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-4 text-xs text-gray-500">
          SFDAN - Federal Funding Accountability Dashboard
        </div>
      </div>
    </footer>
  )
}
