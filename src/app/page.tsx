// src/app/page.tsx
import { fetchLastUpdated } from "@/lib/usaspending";
import { searchProjects } from "@/lib/api";
import { DataCurrencyBadge } from "@/components/DataCurrencyBadge";
import { DataTable } from "@/components/DataTable";
import { FilterSidebar } from "@/components/FilterSidebar";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import Link from "next/link";
import { PaginationState, SortingState } from "@tanstack/react-table";

export const dynamic = 'force-dynamic';

// Client component wrapper for table interactivity
import { useQueryStates, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'

function TableWrapper({ 
  data, 
  pageCount, 
  totalCount,
  initialPage,
  initialSort,
  initialOrder,
}: { 
  data: any[]
  pageCount: number
  totalCount: number
  initialPage: number
  initialSort: string
  initialOrder: 'asc' | 'desc'
}) {
  'use client'
  
  const [page, setPage] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    sort: parseAsString.withDefault('amount'),
    order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
  })
  
  const pagination: PaginationState = {
    pageIndex: (page.page || 1) - 1,
    pageSize: 20,
  }
  
  const sorting: SortingState = [{
    id: page.sort || 'amount',
    desc: (page.order || 'desc') === 'desc',
  }]
  
  return (
    <DataTable
      data={data}
      pageCount={pageCount}
      rowCount={totalCount}
      pagination={pagination}
      sorting={sorting}
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
  )
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: PageProps) {
  // Simple searchParams parsing without nuqs server loader
  let params = {
    q: '',
    state: '',
    agency: '',
    category: '',
    page: 1,
    sort: 'amount',
    order: 'desc' as 'asc' | 'desc',
  }
  
  try {
    const resolved = await searchParams
    params = {
      q: Array.isArray(resolved.q) ? resolved.q[0] : (resolved.q || ''),
      state: Array.isArray(resolved.state) ? resolved.state[0] : (resolved.state || ''),
      agency: Array.isArray(resolved.agency) ? resolved.agency[0] : (resolved.agency || ''),
      category: Array.isArray(resolved.category) ? resolved.category[0] : (resolved.category || ''),
      page: parseInt(Array.isArray(resolved.page) ? resolved.page[0] : (resolved.page || '1')) || 1,
      sort: Array.isArray(resolved.sort) ? resolved.sort[0] : (resolved.sort || 'amount'),
      order: (Array.isArray(resolved.order) ? resolved.order[0] : (resolved.order || 'desc')) as 'asc' | 'desc',
    }
  } catch (e) {
    console.error('Failed to parse searchParams:', e)
  }
  
  let lastUpdated: Date | null = null
  let error: string | null = null

  try {
    const lastUpdatedData = await fetchLastUpdated()
    lastUpdated = lastUpdatedData ? new Date(lastUpdatedData) : null
  } catch (e) {
    console.error('Failed to fetch last updated:', e)
  }

  let searchResult
  try {
    searchResult = await searchProjects({
      query: params.q,
      state: params.state,
      agency: params.agency,
      category: params.category,
      page: params.page,
      pageSize: 20,
      sort: params.sort,
      order: params.order,
    })
  } catch (e) {
    console.error('Failed to search projects:', e)
    error = 'Unable to load project data. Please try again later.'
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Federal Funding Dashboard</h1>
              <p className="text-gray-600">
                Track IIJA infrastructure funding and procedural compliance
              </p>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm">
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
            </nav>
          </div>
          <DataCurrencyBadge 
            lastUpdated={lastUpdated} 
            isLoading={false}
            error={error}
          />
        </header>

        {/* Summary Metrics */}
        {searchResult && (
          <div className="mb-6">
            <DashboardMetrics metrics={searchResult.metrics} />
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : !searchResult || searchResult.data.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {params.q || params.state || params.agency || params.category
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
                  {params.q || params.state || params.agency || params.category ? ' (active)' : ''}
                </summary>
                <div className="p-3 pt-0">
                  <FilterSidebar />
                </div>
              </details>
            </div>
            
            {/* Data Table */}
            <div className="flex-1 min-w-0">
              <TableWrapper
                data={searchResult.data}
                pageCount={searchResult.pagination.pageCount}
                totalCount={searchResult.pagination.totalCount}
                initialPage={params.page}
                initialSort={params.sort}
                initialOrder={params.order}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
