// src/app/newsletter/page.tsx
import Link from 'next/link'
import { NewsletterSignupForm } from '@/components/NewsletterSignupForm'

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            SFDAN
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/methodology" className="text-blue-600 hover:text-blue-800">
              Methodology
            </Link>
            <Link href="/gated-reports" className="text-blue-600 hover:text-blue-800">
              Reports
            </Link>
            <Link href="/assess" className="text-blue-600 hover:text-blue-800">
              Assess
            </Link>
            <span className="text-gray-500">Newsletter</span>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Data-driven insights on federal infrastructure spending
              </h1>
              <p className="text-gray-600 text-lg">
                Get concise, defensible findings on IIJA awards, procedural integrity scores, and
                emerging compliance risks. Built for watchdog reporting and oversight teams.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What you&apos;ll receive
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  Integrity score outliers and red-flag patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  Spending concentration by agency, state, and program
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                  Trend shifts over time, including sudden award spikes
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h3 className="font-medium text-blue-900 mb-2">Example topics</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Agencies with unusually high modification volume</li>
                <li>• States with top-quartile compliance scores</li>
                <li>• Month-over-month shifts in competitive award rates</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Join the newsletter
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe for updates on compliance trends, high-risk signals, and new reports.
              </p>
              <NewsletterSignupForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>SFDAN - Federal Funding Accountability Dashboard</p>
        </div>
      </footer>
    </div>
  )
}
