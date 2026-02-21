// src/components/ExportButton.tsx
'use client'

import { useState } from 'react'

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
}

export function ExportButton({ filters, estimatedRowCount = 0 }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv')
  const [error, setError] = useState<string | null>(null)

  const buildExportUrl = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams()
    params.set('format', format)
    
    if (filters.query) params.set('query', filters.query)
    if (filters.state) params.set('state', filters.state)
    if (filters.agency) params.set('agency', filters.agency)
    if (filters.category) params.set('category', filters.category)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.order) params.set('order', filters.order)
    
    return `/api/export?${params.toString()}`
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    setIsExporting(true)
    setError(null)
    setExportFormat(format)
    setIsOpen(false)

    try {
      const url = buildExportUrl(format)
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Export failed: ${response.status}`)
      }

      // Get the blob
      const blob = await response.blob()
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Set filename with date
      const date = new Date().toISOString().split('T')[0]
      link.download = `sfdan-export-${date}.${format}`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl)
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
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">Export Format</p>
            {estimatedRowCount > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                ~{estimatedRowCount.toLocaleString()} rows
              </p>
            )}
          </div>
          
          <button
            onClick={() => handleExport('csv')}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            <span>CSV</span>
            <span className="text-xs text-gray-400 ml-auto">Spreadsheet</span>
          </button>
          
          <button
            onClick={() => handleExport('xlsx')}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <path d="M8 13h2" />
              <path d="M8 17h2" />
              <path d="M14 13h2" />
              <path d="M14 17h2" />
            </svg>
            <span>Excel</span>
            <span className="text-xs text-gray-400 ml-auto">With summary</span>
          </button>
          
          <div className="px-3 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Ctrl+S shortcut available
            </p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="absolute right-0 mt-2 w-64 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-50">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
