// src/components/ExportButton.tsx
'use client'

import { useState } from 'react'
import { downloadCSV, downloadExcel } from '@/lib/client-export'

interface FilterState {
  query?: string
  state?: string | null
  agency?: string | null
  category?: string | null
  sort?: string
  order?: 'asc' | 'desc'
}

interface ExportButtonProps {
  filters: FilterState
  estimatedRowCount?: number
  projects?: any[] // Add projects data prop for client-side export
}

export function ExportButton({ filters, estimatedRowCount = 0, projects = [] }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: 'csv' | 'xlsx') => {
    setIsExporting(true)
    setError(null)
    setIsOpen(false)

    try {
      if (projects.length === 0) {
        throw new Error('No project data available for export. Please load some data first.');
      }

      const filename = `projects-${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'csv') {
        await downloadCSV(projects, filename);
      } else {
        await downloadExcel(projects, filename);
      }
      
    } catch (err) {
      console.error('Export error:', err)
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Export data"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100">
              Export {estimatedRowCount > 0 ? `${estimatedRowCount} rows` : 'data'} as:
            </div>
            
            {error && (
              <div className="px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-2">
                {error}
              </div>
            )}
            
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV File (.csv)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Comma-separated values, opens in Excel
              </div>
            </button>
            
            <button
              onClick={() => handleExport('xlsx')}
              disabled={isExporting}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 mt-1"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel File (.xlsx)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Microsoft Excel format with formatting
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}