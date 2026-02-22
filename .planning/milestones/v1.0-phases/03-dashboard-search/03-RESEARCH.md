# Phase 3 Research: Dashboard & Search

**Phase:** 3 of 4
**Researched:** 2026-02-20
**Confidence:** HIGH

---

## Standard Stack

### Required Libraries

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| **@tanstack/react-table** | 8.x | Data table with pagination, sorting, filtering | Industry standard for server-side pagination. 16kb gzipped. Handles 10K+ rows efficiently with manual pagination mode. |
| **nuqs** | 2.x | URL state management for filters/search | Type-safe search params that sync with URL. Works with Next.js 15 App Router + Server Components. Replaces manual `useSearchParams` boilerplate. |
| **@tremor/react** | 3.x | Dashboard KPI cards, charts | Pre-built metric cards, spark charts, bar lists optimized for dashboards. Built on Recharts + Tailwind. |
| **recharts** | 2.x | Custom charts if needed | Tremor dependency. Use directly for custom visualizations not covered by Tremor. |

### Already Installed (from package.json)

| Library | Version | Usage |
|---------|---------|-------|
| Next.js | 15.1.6 | App Router, Server Components |
| React | 19.x | UI library |
| Tailwind CSS | 3.4.1 | Styling |
| date-fns | 4.1.0 | Date formatting |
| @supabase/supabase-js | 2.47.0 | Database queries |

### Installation Commands

```bash
# Data table
npm install @tanstack/react-table

# URL state management
npm install nuqs

# Dashboard components
npm install @tremor/react recharts

# If using shadcn/ui table (already have Tailwind)
npx shadcn@latest add table button input select
```

---

## Architecture Patterns

### 1. Server-Side Pagination Flow (Next.js 15 App Router)

```
┌─────────────────────────────────────────────────────────────────┐
│  USER INTERACTION (Client Component)                            │
│  - User types in search / clicks filter / changes page         │
│  - nuqs updates URL: ?q=transport&page=2&state=CA              │
└─────────────────────┬───────────────────────────────────────────┘
                      │ URL change triggers navigation
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVER COMPONENT (page.tsx)                                    │
│  - Receives searchParams prop from Next.js                     │
│  - Calls API layer with parsed params                          │
│  - Renders table with data + pagination controls               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  BFF/API LAYER (Server Action or Route Handler)                │
│  - Validates params                                             │
│  - Queries Supabase with filters + pagination + sorting        │
│  - Returns { data, totalCount, pageCount }                     │
└─────────────────────────────────────────────────────────────────┘
```

### 2. TanStack Table Manual Pagination Pattern

```typescript
// DataTable component - CLIENT COMPONENT
'use client'

import { useReactTable, getCoreRowModel, PaginationState } from '@tanstack/react-table'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pageCount: number
  rowCount: number
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
}

export function DataTable<TData>({
  data,
  columns,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    
    // SERVER-SIDE PAGINATION CONFIG
    manualPagination: true,      // We handle pagination on server
    pageCount: pageCount,        // Total pages from server
    rowCount: rowCount,          // Total rows from server (v8.13.0+)
    
    // Controlled state
    state: { pagination },
    onPaginationChange,
  })
  
  // ... render
}
```

### 3. nuqs Filter State Pattern

```typescript
// search-params.ts - Shared between client and server
import { createLoader, parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server'

export const dashboardSearchParams = {
  q: parseAsString.withDefault(''),           // Search query
  page: parseAsInteger.withDefault(1),        // Page number
  state: parseAsString,                        // US state filter
  agency: parseAsString,                       // Federal agency filter
  category: parseAsStringLiteral(['transportation', 'broadband', 'clean_energy'] as const),
  sort: parseAsString.withDefault('amount'),   // Sort column
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
}

// Server-side loader for page.tsx
export const loadDashboardParams = createLoader(dashboardSearchParams)

// Client hook for filter components
// useQueryStates from nuqs gives same type-safe access
```

```typescript
// page.tsx - SERVER COMPONENT
import { loadDashboardParams } from './search-params'
import { searchProjects } from '@/lib/api'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await loadDashboardParams(searchParams)
  
  // params is fully typed with defaults applied
  const { data, totalCount, pageCount } = await searchProjects({
    query: params.q,
    state: params.state,
    agency: params.agency,
    category: params.category,
    page: params.page,
    pageSize: 20,
    sort: params.sort,
    order: params.order,
  })
  
  return <DashboardClient data={data} pageCount={pageCount} />
}
```

### 4. Debounced Search Pattern

**Use nuqs built-in debouncing (recommended):**

```typescript
'use client'

import { useQueryState, parseAsString } from 'nuqs'

export function SearchInput() {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString
      .withDefault('')
      .withOptions({ 
        debounceMs: 300,        // Wait 300ms after user stops typing
        shallow: false,          // Trigger server re-fetch
      })
  )
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value || null)}
      placeholder="Search projects..."
    />
  )
}
```

**Alternative: Custom useDebounce hook if not using nuqs:**

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

---

## Don't Hand-Roll

### Never Build Custom Solutions For:

| What | Use Instead | Why |
|------|-------------|-----|
| **Pagination logic** | TanStack Table `manualPagination` + `pageCount` | Handles edge cases, accessibility, page boundaries |
| **Sort state management** | TanStack Table `manualSorting` + `onSortingChange` | Multi-column sort, sort direction cycling |
| **URL filter sync** | nuqs `useQueryStates` | Type-safe, SSR-safe, handles history/batching |
| **Search debouncing** | nuqs `debounceMs` option | Built-in, no race conditions |
| **Mobile responsive tables** | TanStack column visibility + Tailwind `hidden md:table-cell` | Progressive enhancement |
| **KPI metric cards** | Tremor `<Card>`, `<Metric>`, `<Flex>` | Consistent styling, accessibility |
| **Filter combination (AND logic)** | Supabase query builder `.and()` | Parameterized, SQL injection safe |
| **Full-text search** | PostgreSQL `websearch_to_tsquery()` | Ranking, stemming, phrase search |

---

## Common Pitfalls

### 1. URL State Not Persisting on Refresh

**Symptom:** Filters reset when page reloads

**Cause:** Using `useState` instead of URL params, or `useSearchParams` in Server Component

**Fix:** Use nuqs `useQueryStates` for client components, `searchParams` prop for server pages

```typescript
// WRONG - Lost on refresh
const [filter, setFilter] = useState('')

// RIGHT - Persists in URL
const [filter, setFilter] = useQueryState('filter', parseAsString)
```

### 2. Over-Fetching on Every Keystroke

**Symptom:** 50 API calls while typing "infrastructure"

**Cause:** No debounce on search input

**Fix:** Use nuqs `debounceMs: 300` option

```typescript
const [q, setQ] = useQueryState('q', parseAsString.withOptions({ debounceMs: 300 }))
```

### 3. TanStack Table Page Count Wrong

**Symptom:** Pagination shows wrong total, "next" button disabled incorrectly

**Cause:** Not passing `rowCount` or `pageCount` from server response

**Fix (v8.13.0+):** Pass `rowCount` directly

```typescript
const table = useReactTable({
  manualPagination: true,
  rowCount: serverResponse.totalCount,  // NOT data.length
  // ...
})
```

### 4. Mobile Table Overflows

**Symptom:** Horizontal scroll on mobile, columns cut off

**Cause:** Too many columns, no responsive strategy

**Fix:** Three options (pick one):

**Option A: Hide columns on mobile (recommended)**
```typescript
{
  accessorKey: 'agency',
  header: 'Agency',
  meta: {
    className: 'hidden md:table-cell',  // Hide on mobile
  },
}
```

**Option B: Card layout on mobile**
```typescript
// In DataTable render
<div className="md:hidden">
  {data.map(row => <ProjectCard key={row.id} project={row} />)}
</div>
<div className="hidden md:block">
  <Table>...</Table>
</div>
```

**Option C: Column visibility toggle**
```typescript
const [columnVisibility, setColumnVisibility] = useState({
  description: false,  // Hidden by default on all sizes
  // Mobile: hide extra columns
})
```

### 5. Filter Combination Not Working

**Symptom:** Multiple filters show OR results instead of AND

**Cause:** Using `.or()` instead of `.and()` in Supabase query

**Fix:**
```typescript
// WRONG - OR logic
.or(`state.eq.${state},agency.eq.${agency}`)

// RIGHT - AND logic
.eq('state', state)
.eq('agency', agency)
```

---

## Code Examples

### Full Server-Side Pagination Example

```typescript
// lib/api/projects.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function searchProjects(params: {
  query?: string
  state?: string
  agency?: string
  category?: string
  page: number
  pageSize: number
  sort: string
  order: 'asc' | 'desc'
}) {
  const { query, state, agency, category, page, pageSize, sort, order } = params
  const offset = (page - 1) * pageSize
  
  let dbQuery = supabase
    .from('projects')
    .select('*', { count: 'exact' })
  
  // Full-text search on name and description
  if (query) {
    dbQuery = dbQuery.textSearch('fts', query, {
      type: 'websearch',
      config: 'english',
    })
  }
  
  // AND filters
  if (state) dbQuery = dbQuery.eq('state', state)
  if (agency) dbQuery = dbQuery.eq('agency', agency)
  if (category) dbQuery = dbQuery.eq('category', category)
  
  // Sorting
  dbQuery = dbQuery.order(sort, { ascending: order === 'asc' })
  
  // Pagination
  dbQuery = dbQuery.range(offset, offset + pageSize - 1)
  
  const { data, error, count } = await dbQuery
  
  if (error) throw error
  
  return {
    data,
    totalCount: count ?? 0,
    pageCount: Math.ceil((count ?? 0) / pageSize),
  }
}
```

### Tremor KPI Cards Example

```typescript
import { Card, Metric, Text, Flex, BadgeDelta, DeltaType } from '@tremor/react'

interface SummaryMetrics {
  totalSpending: number
  projectCount: number
  avgScore: number
  scoreChange: number
}

export function DashboardMetrics({ metrics }: { metrics: SummaryMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <Text>Total Spending</Text>
        <Metric>${(metrics.totalSpending / 1e9).toFixed(1)}B</Metric>
      </Card>
      
      <Card>
        <Text>Projects</Text>
        <Metric>{metrics.projectCount.toLocaleString()}</Metric>
      </Card>
      
      <Card>
        <Text>Avg. Compliance Score</Text>
        <Flex alignItems="items-baseline" className="gap-2">
          <Metric>{metrics.avgScore}</Metric>
          <BadgeDelta deltaType={metrics.scoreChange >= 0 ? 'increase' : 'decrease'}>
            {Math.abs(metrics.scoreChange).toFixed(1)}%
          </BadgeDelta>
        </Flex>
      </Card>
    </div>
  )
}
```

### Filter Sidebar with nuqs

```typescript
'use client'

import { useQueryStates, parseAsString, parseAsStringLiteral, parseAsInteger } from 'nuqs'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const STATES = ['CA', 'TX', 'NY', 'FL', /* ... */]
const AGENCIES = ['DOE', 'DOT', 'EPA', 'HUD', 'USDA']
const CATEGORIES = ['transportation', 'broadband', 'clean_energy'] as const

export function FilterSidebar() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault('').withOptions({ debounceMs: 300, shallow: false }),
    state: parseAsString,
    agency: parseAsString,
    category: parseAsStringLiteral(CATEGORIES),
    page: parseAsInteger.withDefault(1),
  })
  
  const updateFilter = (key: string, value: string | null) => {
    setParams({ [key]: value, page: 1 })  // Reset to page 1 on filter change
  }
  
  return (
    <aside className="space-y-4">
      <Input
        placeholder="Search projects..."
        value={params.q}
        onChange={(e) => updateFilter('q', e.target.value || null)}
      />
      
      <Select
        value={params.state ?? ''}
        onValueChange={(v) => updateFilter('state', v || null)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All States</SelectItem>
          {STATES.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Similar for agency, category */}
      
      {(params.state || params.agency || params.category) && (
        <Button variant="ghost" onClick={() => setParams({ state: null, agency: null, category: null })}>
          Clear Filters
        </Button>
      )}
    </aside>
  )
}
```

---

## API Design

### Dashboard Endpoint Structure

**Route:** `/api/dashboard` or Server Action

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | `""` | Full-text search query |
| `state` | string? | - | US state code (e.g., "CA") |
| `agency` | string? | - | Federal agency code |
| `category` | string? | - | Project category |
| `page` | number | `1` | Page number (1-indexed) |
| `pageSize` | number | `20` | Rows per page (max: 100) |
| `sort` | string | `"amount"` | Sort column |
| `order` | `"asc"\|"desc"` | `"desc"` | Sort direction |

**Response:**

```typescript
interface DashboardResponse {
  data: Project[]
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
```

### PostgreSQL Full-Text Search Setup

```sql
-- Add generated tsvector column for fast searching
ALTER TABLE projects 
ADD COLUMN fts tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX projects_fts_idx ON projects USING GIN (fts);

-- Query with ranking
SELECT *, ts_rank(fts, websearch_to_tsquery('english', $query)) as rank
FROM projects
WHERE fts @@ websearch_to_tsquery('english', $query)
ORDER BY rank DESC;
```

---

## Mobile Considerations

### Responsive Strategy

1. **Primary: Hide non-essential columns on mobile**
   - Show: Project name, Score, Amount
   - Hide: Description, Agency, Dates, Category

2. **Secondary: Stack cards on mobile (if table still too wide)**
   - Convert table rows to card layout below `md` breakpoint

3. **Filters: Collapsible sidebar on mobile**
   - Full sidebar on desktop
   - Collapsible drawer/modal on mobile

### Breakpoints

```typescript
// Tailwind classes for responsive columns
{
  accessorKey: 'name',
  header: 'Project',
  // Always visible
}
{
  accessorKey: 'score', 
  header: 'Score',
  // Always visible
}
{
  accessorKey: 'amount',
  header: 'Amount', 
  meta: { className: 'hidden sm:table-cell' },  // Hide on xs
}
{
  accessorKey: 'agency',
  header: 'Agency',
  meta: { className: 'hidden md:table-cell' },  // Hide on xs, sm
}
{
  accessorKey: 'description',
  header: 'Description',
  meta: { className: 'hidden lg:table-cell' },  // Hide on xs, sm, md
}
```

---

## Sources

| Source | Confidence | Key Insights |
|--------|------------|--------------|
| TanStack Table v8 docs (tanstack.com/table) | HIGH | `manualPagination`, `rowCount`, `pageCount` patterns |
| nuqs docs (nuqs.dev) | HIGH | URL state management, `debounceMs`, `createLoader` for SSR |
| Tremor docs (tremor.so) | HIGH | Dashboard components, KPI cards |
| Supabase Full-Text Search docs | HIGH | `websearch_to_tsquery`, GIN indexes |
| Next.js 15 docs - useSearchParams | HIGH | Server vs client component patterns |
| Medium: "Shadcn DataTable Server Side Pagination" | MEDIUM | App Router integration patterns |
| Reddit: "Is there any reason to use Tanstack Table if all filtering/sorting is server-side?" | MEDIUM | Value of TanStack Table even with server-side ops |
| Stack Overflow: TanStack manual sorting/pagination | MEDIUM | Common implementation issues |

---

## Recommendations Summary

1. **Use TanStack Table 8.x** with `manualPagination: true` and `manualSorting: true`
2. **Use nuqs 2.x** for all URL state management (filters, search, pagination, sort)
3. **Use Tremor 3.x** for KPI cards and summary metrics
4. **Use PostgreSQL Full-Text Search** with generated `tsvector` column and GIN index
5. **Implement debounced search** via nuqs `debounceMs: 300` option
6. **Mobile strategy**: Hide columns on small screens, keep table layout (don't switch to cards unless necessary)
7. **AND logic for filters**: Chain Supabase `.eq()` calls, don't use `.or()`

---

*Research completed: 2026-02-20*
*Phase: 3 - Dashboard & Search*
