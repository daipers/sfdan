// src/components/ContentFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FEDERAL_AGENCIES, US_STATES } from '@/lib/search-params'

interface ContentFiltersProps {
  initialFilters?: {
    query?: string
    type?: string
    agency?: string
    state?: string
    dateFrom?: string
    dateTo?: string
    tag?: string
  }
}

const CONTENT_TYPES = ['insight', 'analysis', 'report']

export function ContentFilters({ initialFilters }: ContentFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialFilters?.query || '')
  const [type, setType] = useState(initialFilters?.type || '')
  const [agency, setAgency] = useState(initialFilters?.agency || '')
  const [state, setState] = useState(initialFilters?.state || '')
  const [dateFrom, setDateFrom] = useState(initialFilters?.dateFrom || '')
  const [dateTo, setDateTo] = useState(initialFilters?.dateTo || '')
  const [tag, setTag] = useState(initialFilters?.tag || '')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()

    if (query) params.set('q', query)
    if (type) params.set('type', type)
    if (agency) params.set('agency', agency)
    if (state) params.set('state', state)
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo) params.set('to', dateTo)
    if (tag) params.set('tag', tag)

    const queryString = params.toString()
    router.push(queryString ? `/content?${queryString}` : '/content')
  }

  const handleReset = () => {
    setQuery('')
    setType('')
    setAgency('')
    setState('')
    setDateFrom('')
    setDateTo('')
    setTag('')
    if (searchParams.toString()) {
      router.push('/content')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div>
        <label htmlFor="content-search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="content-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search findings, topics, or agencies"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <select
            id="content-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All types</option>
            {CONTENT_TYPES.map((contentType) => (
              <option key={contentType} value={contentType}>
                {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content-agency" className="block text-sm font-medium text-gray-700 mb-1">
            Agency
          </label>
          <select
            id="content-agency"
            value={agency}
            onChange={(event) => setAgency(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All agencies</option>
            {FEDERAL_AGENCIES.map((agencyOption) => (
              <option key={agencyOption} value={agencyOption}>
                {agencyOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content-state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            id="content-state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All states</option>
            {US_STATES.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content-tag" className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <input
            id="content-tag"
            type="text"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            placeholder="e.g. low-risk"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="content-from" className="block text-sm font-medium text-gray-700 mb-1">
            Published From
          </label>
          <input
            id="content-from"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="content-to" className="block text-sm font-medium text-gray-700 mb-1">
            Published To
          </label>
          <input
            id="content-to"
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
