// src/components/FilterSidebar.tsx
'use client'

import { useQueryStates, parseAsString, parseAsStringLiteral, parseAsInteger, debounce } from 'nuqs'
import { US_STATES, FEDERAL_AGENCIES, PROJECT_CATEGORIES } from '@/lib/search-params'

export function FilterSidebar() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault('').withOptions({ 
      shallow: false, // Trigger server re-fetch
      limitUrlUpdates: debounce(300),
    }),
    state: parseAsString,
    agency: parseAsString,
    category: parseAsStringLiteral(PROJECT_CATEGORIES),
    page: parseAsInteger.withDefault(1),
  })

  const updateFilter = (key: string, value: string | null) => {
    // Reset to page 1 when filter changes
    setParams({ [key]: value, page: 1 })
  }

  const clearFilters = () => {
    setParams({
      q: null,
      state: null,
      agency: null,
      category: null,
      page: 1,
    })
  }

  const hasActiveFilters = params.state || params.agency || params.category || params.q

  return (
    <aside className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search projects..."
          value={params.q}
          onChange={(e) => updateFilter('q', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          value={params.state ?? ''}
          onChange={(e) => updateFilter('state', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All States</option>
          {US_STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Agency Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agency
        </label>
        <select
          value={params.agency ?? ''}
          onChange={(e) => updateFilter('agency', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Agencies</option>
          {FEDERAL_AGENCIES.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={params.category ?? ''}
          onChange={(e) => updateFilter('category', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {PROJECT_CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </aside>
  )
}
