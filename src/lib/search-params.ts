// src/lib/search-params.ts
import { createLoader, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server'

// Project categories for IIJA
export const PROJECT_CATEGORIES = ['transportation', 'broadband', 'clean_energy', 'water', 'other'] as const

// Federal agencies
export const FEDERAL_AGENCIES = ['DOT', 'DOE', 'EPA', 'HUD', 'USDA'] as const

// US States (abbreviated list for filter)
export const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] as const

export const dashboardSearchParams = {
  // Search query (debounced in client component)
  q: parseAsString.withDefault(''),
  
  // Pagination
  page: parseAsInteger.withDefault(1),
  
  // Filters
  state: parseAsString,
  agency: parseAsString,
  category: parseAsStringLiteral(PROJECT_CATEGORIES),
  
  // Sorting
  sort: parseAsString.withDefault('amount'),
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
}

// Server-side loader for page.tsx
export const loadDashboardParams = createLoader(dashboardSearchParams)
