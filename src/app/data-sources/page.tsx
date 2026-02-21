// src/app/data-sources/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Data Sources - Procedural Compliance Score',
  description: 'Information about where our data comes from and how often it is updated',
}

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>
        
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Data Sources & Methodology
          </h1>
          <p className="text-xl text-gray-600">
            Understanding where our data comes from and how we use it
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {/* Primary Data Source */}
          <section className="mb-10">
            <h2>Primary Data Source</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">USASpending.gov</h3>
                  <p className="text-sm text-gray-500">Official U.S. Government Spending Data</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                All award data is sourced from{' '}
                <a 
                  href="https://www.usaspending.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  USASpending.gov
                </a>
                , the official government website for federal spending data. 
                This is the most comprehensive source of information about how federal dollars 
                are being spent on infrastructure projects.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-1">API Version</h4>
                  <p className="text-sm text-gray-600">USASpending API v2</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-1">Endpoint</h4>
                  <p className="text-sm text-gray-600">/search/spending_by_award</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Coverage */}
          <section className="mb-10">
            <h2>Data Coverage</h2>
            <p className="text-gray-700 mt-4">
              We focus specifically on awards funded by the Infrastructure Investment and 
              Jobs Act (IIJA), also known as the Bipartisan Infrastructure Law. This includes 
              funding from five federal agencies:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Department of Transportation (DOT)</li>
              <li>Department of Energy (DOE)</li>
              <li>Environmental Protection Agency (EPA)</li>
              <li>Department of Housing and Urban Development (HUD)</li>
              <li>Department of Agriculture (USDA)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We include grants (Assistance Type 3), cooperative agreements (Type 4), 
              and loans (Type 5) with Award Type Codes A, B, C, and D.
            </p>
          </section>

          {/* Update Frequency */}
          <section className="mb-10">
            <h2>Update Frequency</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <h3 className="font-semibold text-green-900">Daily Refresh</h3>
              </div>
              <p className="text-green-800">
                Our database is refreshed daily from the USASpending.gov API. 
                The "Data as of" date on the dashboard shows when the data was last updated.
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Note: Federal agencies report data with varying delays. Recent awards may take 
              several days or weeks to appear in the database.
            </p>
          </section>

          {/* Data Fields Used */}
          <section className="mb-10">
            <h2>Data Fields Used in Scoring</h2>
            <p className="text-gray-700 mt-4">
              We use the following fields from USASpending.gov to calculate our procedural 
              compliance scores:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Field</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4">Award ID</td>
                    <td className="py-3 px-4 text-gray-600">Unique identifier for each award</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Description</td>
                    <td className="py-3 px-4 text-gray-600">Keyword analysis for project type</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Awarding Agency</td>
                    <td className="py-3 px-4 text-gray-600">Infrastructure sector classification</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Award Amount</td>
                    <td className="py-3 px-4 text-gray-600">Funding level display</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Start Date / End Date</td>
                    <td className="py-3 px-4 text-gray-600">Period of performance evaluation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Assistance Type</td>
                    <td className="py-3 px-4 text-gray-600">Competition level assessment</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Recipient Name</td>
                    <td className="py-3 px-4 text-gray-600">Recipient type classification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Known Limitations */}
          <section className="mb-10">
            <h2>Known Data Limitations</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-4">
              <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                <li>
                  <strong>Reporting Delay:</strong> Agencies report data with a lag. Recent 
                  awards may not appear immediately.
                </li>
                <li>
                  <strong>Data Completeness:</strong> Not all procedural compliance indicators 
                  are captured in USASpending.gov data.
                </li>
                <li>
                  <strong>Description Quality:</strong> Project descriptions vary in detail, 
                  which affects scoring accuracy.
                </li>
                <li>
                  <strong>Recipient Information:</strong> Some recipient names may be truncated 
                  or use parent company names.
                </li>
                <li>
                  <strong>Historical Data:</strong> Data availability may be limited for awards 
                  before November 2021 (IIJA signing date).
                </li>
              </ul>
            </div>
          </section>

          {/* Links */}
          <section className="mb-10">
            <h2>External Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <a 
                href="https://www.usaspending.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">USASpending.gov</span>
                <span className="block text-sm text-gray-500">Official federal spending database</span>
              </a>
              <a 
                href="https://usaspending-help.zendesk.com/hc/en-us" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">USASpending Help Center</span>
                <span className="block text-sm text-gray-500">Documentation and support</span>
              </a>
              <a 
                href="https://github.com/fedspendingtransparency/usaspending-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">USASpending API</span>
                <span className="block text-sm text-gray-500">API documentation on GitHub</span>
              </a>
              <Link 
                href="/methodology"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">Scoring Methodology</span>
                <span className="block text-sm text-gray-500">How scores are calculated</span>
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
              <p className="text-sm text-gray-600">
                This tool provides independent analysis based on publicly available federal 
                data. The procedural compliance scores are indicators derived from available 
                data and should not be used as legal or regulatory determinations. Low scores 
                do not indicate violations of law—they indicate limited compliance indicators 
                in the available data. For official information about federal awards, contact 
                the awarding agency directly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
