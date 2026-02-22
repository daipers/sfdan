// src/components/SiteFooter.tsx
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-gray-500">
        <div>
          <p className="text-gray-700 font-medium">SFDAN</p>
          <p className="text-gray-500">
            Data-driven insights on federal infrastructure spending.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/newsletter" className="text-blue-600 hover:text-blue-800">
            Newsletter
          </Link>
          <Link href="/methodology" className="text-blue-600 hover:text-blue-800">
            Methodology
          </Link>
          <Link href="/gated-reports" className="text-blue-600 hover:text-blue-800">
            Reports
          </Link>
        </div>
      </div>
    </footer>
  )
}
