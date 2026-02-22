'use client'

import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'
import { fetchLastUpdated } from '@/lib/usaspending'
import { searchProjects } from '@/lib/api'
import { DataCurrencyBadge } from '@/components/DataCurrencyBadge'
import { DataTable } from '@/components/DataTable'
import { FilterSidebar } from '@/components/FilterSidebar'
import { DashboardMetrics } from '@/components/DashboardMetrics'
import { SiteFooter } from '@/components/SiteFooter'
import { trackEvent } from '@/lib/analytics'
import { useQueryStates, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'
import { PaginationState, SortingState } from '@tanstack/react-table'

// Client-side wrapper that handles everything
export default function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedParams = use(searchParams)
  
  const [page, setPage] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    sort: parseAsString.withDefault('amount'),
    order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
    q: parseAsString.withDefault(''),
    state: parseAsString.withDefault(''),
    agency: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
  })

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasTracked = useRef(false)

  // Fetch data when page params change
  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true
      void trackEvent({
        eventName: 'page_view',
        journey: 'explore',
        step: 'home',
        source: 'homepage',
      })
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch last updated
        const lastUpdatedData = await fetchLastUpdated()
        setLastUpdated(lastUpdatedData ? new Date(lastUpdatedData) : null)
        
        // Fetch projects
        const result = await searchProjects({
          query: page.q || '',
          state: page.state || '',
          agency: page.agency || '',
          category: page.category || '',
          page: page.page || 1,
          pageSize: 20,
          sort: page.sort || 'amount',
          order: page.order || 'desc',
        })
        setSearchResult(result)
      } catch (e) {
        console.error('Failed to fetch data:', e)
        setError('Unable to load project data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page.page, page.sort, page.order, page.q, page.state, page.agency, page.category])

  const pagination: PaginationState = {
    pageIndex: (page.page || 1) - 1,
    pageSize: 20,
  }

  const sorting: SortingState = [{
    id: page.sort || 'amount',
    desc: (page.order || 'desc') === 'desc',
  }]

  return (
    <>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Federal Funding Dashboard</h1>
              <p className="text-gray-600">
                Track IIJA infrastructure funding and procedural compliance.{' '}
                <Link href="/assess" className="text-blue-600 hover:text-blue-800 underline">
                  Assess your project
                </Link>{' '}
                for a private compliance score.
              </p>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/content"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Findings
              </Link>
              <Link
                href="/assess"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Assess Your Project
              </Link>
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Methodology
              </Link>
              <Link
                href="/faq"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                FAQ
              </Link>
              <Link
                href="/data-sources"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Data Sources
              </Link>
              <Link
                href="/gated-reports"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Reports
              </Link>
              <Link
                href="/newsletter"
                className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
              >
                Newsletter
              </Link>
            </nav>
          </div>
          <DataCurrencyBadge
            lastUpdated={lastUpdated}
            isLoading={loading}
            error={error}
          />
        </header>

        {/* Summary Metrics */}
        {searchResult && !loading && (
          <div className="mb-6">
            <DashboardMetrics metrics={searchResult.metrics} />
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : loading ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">Loading project data...</p>
          </div>
        ) : !searchResult || searchResult.data.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {page.q || page.state || page.agency || page.category
                ? 'No projects match your filters. Try adjusting your search criteria.'
                : 'No award data available at this time.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">
                <FilterSidebar />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <details className="bg-gray-50 rounded-lg">
                <summary className="p-3 cursor-pointer font-medium text-gray-700">
                  Filters
                  {page.q || page.state || page.agency || page.category ? ' (active)' : ''}
                </summary>
                <div className="p-3 pt-0">
                  <FilterSidebar />
                </div>
              </details>
            </div>

            {/* Data Table */}
            <div className="flex-1 min-w-0">
              <DataTable
                data={searchResult.data}
                pageCount={searchResult.pagination.pageCount}
                rowCount={searchResult.pagination.totalCount}
                pagination={pagination}
                sorting={sorting}
                filters={{
                  query: page.q || undefined,
                  state: page.state || null,
                  agency: page.agency || null,
                  category: page.category || null,
                  sort: page.sort || 'amount',
                  order: page.order || 'desc',
                }}
                onPaginationChange={(updater) => {
                  const newPagination = typeof updater === 'function' ? updater(pagination) : updater
                  setPage({ page: newPagination.pageIndex + 1 })
                }}
                onSortingChange={(updater) => {
                  const newSorting = typeof updater === 'function' ? updater(sorting) : updater
                  const sort = newSorting[0]
                  setPage({
                    sort: sort?.id || 'amount',
                    order: sort?.desc ? 'desc' : 'asc',
                    page: 1
                  })
                }}
              />
            </div>
          </div>
        )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
