// src/lib/api.ts
import { fetchAwards, AwardSearchResult } from './usaspending'
import { PROJECT_CATEGORIES, FEDERAL_AGENCIES } from './search-params'

export interface SearchParams {
  query?: string
  state?: string | null
  agency?: string | null
  category?: string | null
  page: number
  pageSize?: number
  sort: string
  order: 'asc' | 'desc'
}

export interface SearchResult {
  data: any[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    pageCount: number
  }
  metrics: {
    totalSpending: number
    projectCount: number
    avgScore: number
  }
}

/**
 * Server-side search function for dashboard
 * Queries USASpending API with filters, pagination, and sorting
 */
export async function searchProjects(params: SearchParams): Promise<SearchResult> {
  const { query, state, agency, category, page, pageSize = 20, sort, order } = params
  
  // Map agency codes to full names for USASpending API
  const agencyMap: Record<string, string> = {
    'DOT': 'Department of Transportation',
    'DOE': 'Department of Energy',
    'EPA': 'Environmental Protection Agency',
    'HUD': 'Department of Housing and Urban Development',
    'USDA': 'Department of Agriculture',
  }
  
  // Build agency filter if specified
  const agencies = agency ? [agencyMap[agency] || agency] : undefined
  
  // Fetch from USASpending API
  const result = await fetchAwards({
    agencies,
    page,
    pageSize,
  })
  
  // Client-side filtering (USASpending API has limited filter support)
  let filteredResults = result.results || []
  
  // Filter by search query (keyword search in description/recipient)
  if (query) {
    const q = query.toLowerCase()
    filteredResults = filteredResults.filter((award: any) => {
      const desc = (award['Description'] || '').toLowerCase()
      const recipient = (award['Recipient Name'] || '').toLowerCase()
      const awardId = (award['Award ID'] || '').toLowerCase()
      return desc.includes(q) || recipient.includes(q) || awardId.includes(q)
    })
  }
  
  // Filter by state (if available in award data)
  if (state) {
    // Note: USASpending returns state in 'Place of Performance State' or 'recipient_state' fields
    filteredResults = filteredResults.filter((award: any) => {
      const popState = award['Place of Performance State'] || award['recipient_state']
      return popState === state
    })
  }
  
  // Filter by category (keyword-based classification)
  if (category) {
    const categoryKeywords: Record<string, string[]> = {
      'transportation': ['highway', 'bridge', 'road', 'transit', 'rail', 'airport', 'port'],
      'broadband': ['broadband', 'internet', 'fiber', 'connectivity', 'digital'],
      'clean_energy': ['energy', 'solar', 'wind', 'renewable', 'grid', 'battery', 'electric'],
      'water': ['water', 'sewer', 'wastewater', 'storm', 'drainage'],
      'other': [],
    }
    
    const keywords = categoryKeywords[category] || []
    if (keywords.length > 0) {
      filteredResults = filteredResults.filter((award: any) => {
        const desc = (award['Description'] || '').toLowerCase()
        return keywords.some(kw => desc.includes(kw))
      })
    }
  }
  
  // Sort results
  const sortFieldMap: Record<string, string> = {
    'amount': 'Award Amount',
    'date': 'Start Date',
    'score': 'score.total',
  }
  
  const sortField = sortFieldMap[sort] || 'Award Amount'
  
  filteredResults.sort((a: any, b: any) => {
    let aVal: any, bVal: any
    
    if (sortField === 'score.total') {
      aVal = a.score?.total ?? 0
      bVal = b.score?.total ?? 0
    } else {
      aVal = a[sortField] ?? 0
      bVal = b[sortField] ?? 0
    }
    
    // Handle dates
    if (sortField === 'Start Date') {
      aVal = aVal ? new Date(aVal).getTime() : 0
      bVal = bVal ? new Date(bVal).getTime() : 0
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })
  
  // Calculate metrics from all filtered results
  const totalCount = filteredResults.length
  const totalSpending = filteredResults.reduce((sum: number, a: any) => sum + (a['Award Amount'] || 0), 0)
  const avgScore = filteredResults.reduce((sum: number, a: any) => sum + (a.score?.total ?? 0), 0) / Math.max(totalCount, 1)
  
  // Apply pagination after filtering and sorting
  const pageCount = Math.ceil(totalCount / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedData = filteredResults.slice(startIndex, startIndex + pageSize)
  
  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalCount,
      pageCount,
    },
    metrics: {
      totalSpending,
      projectCount: totalCount,
      avgScore: Math.round(avgScore),
    },
  }
}
