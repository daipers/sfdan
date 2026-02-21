// src/components/DataTable.tsx
'use client'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { getScoreColorClass, getScoreDescription } from '@/lib/scoring'

interface Award {
  'Award ID': string
  'Description'?: string
  'Recipient Name'?: string
  'Awarding Agency'?: string
  'Funding Agency'?: string
  'Award Amount'?: number
  'Start Date'?: string
  'End Date'?: string
  score?: {
    environmental: number
    competitiveBidding: number
    modificationAuth: number
    total: number
  }
}

// Define meta type for columns
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string
  }
}

interface DataTableProps {
  data: Award[]
  pageCount: number
  rowCount: number
  pagination: PaginationState
  sorting: SortingState
  onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void
  onSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => void
}

const columns: ColumnDef<Award>[] = [
  {
    accessorKey: 'Description',
    header: 'Project',
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="font-medium truncate" title={row.original['Description']}>
          {row.original['Description'] || row.original['Award ID'] || 'Untitled'}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {row.original['Recipient Name']}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'score.total',
    header: 'Score',
    cell: ({ row }) => {
      const score = row.original.score?.total
      if (score === undefined) return <span className="text-gray-400">—</span>
      return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColorClass(score)}`}>
          {score}
        </span>
      )
    },
    meta: { className: 'w-20' },
  },
  {
    accessorKey: 'Award Amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.original['Award Amount'] || 0
      return (
        <span className="font-medium text-green-700">
          {amount >= 1000000 
            ? `$${(amount / 1000000).toFixed(1)}M` 
            : `$${(amount / 1000).toFixed(0)}K`}
        </span>
      )
    },
    meta: { className: 'w-28 hidden sm:table-cell' },
  },
  {
    accessorKey: 'Awarding Agency',
    header: 'Agency',
    cell: ({ row }) => (
      <span className="text-sm">{row.original['Awarding Agency'] || 'N/A'}</span>
    ),
    meta: { className: 'hidden md:table-cell' },
  },
  {
    accessorKey: 'Start Date',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = row.original['Start Date']
      return date ? (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ) : <span className="text-gray-400">—</span>
    },
    meta: { className: 'hidden lg:table-cell' },
  },
]

export function DataTable({
  data,
  pageCount,
  rowCount,
  pagination,
  sorting,
  onPaginationChange,
  onSortingChange,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    
    // Server-side pagination
    manualPagination: true,
    pageCount,
    rowCount,
    state: { pagination, sorting },
    onPaginationChange,
    onSortingChange,
    
    // Server-side sorting
    manualSorting: true,
  })

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left font-medium text-gray-700 ${header.column.columnDef.meta?.className || ''}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Future: Navigate to detail page
                    console.log('Clicked award:', row.original['Award ID'])
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id}
                      className={`px-4 py-3 ${cell.column.columnDef.meta?.className || ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-500">
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, rowCount)} of {rowCount} results
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: 0 })}
            disabled={pagination.pageIndex === 0}
          >
            First
          </button>
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
            disabled={pagination.pageIndex === 0}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
            disabled={pagination.pageIndex >= pageCount - 1}
          >
            Next
          </button>
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pageCount - 1 })}
            disabled={pagination.pageIndex >= pageCount - 1}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}
