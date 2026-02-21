// src/lib/export.ts
import * as XLSX from 'xlsx'

export interface ExportAward {
  'Award ID': string
  'Description'?: string
  'Recipient Name'?: string
  'Awarding Agency'?: string
  'Funding Agency'?: string
  'Award Amount'?: number
  'Start Date'?: string
  'End Date'?: string
  'Place of Performance State'?: string
  score?: {
    environmental: number
    competitiveBidding: number
    modificationAuth: number
    total: number
  }
}

/**
 * Transform award data for export format
 * Handles missing values gracefully
 */
export function transformForExport(awards: ExportAward[]): Record<string, any>[] {
  return awards.map(award => ({
    'Award ID': award['Award ID'] || '',
    'Project Name': award['Description'] || award['Award ID'] || 'Untitled',
    'Recipient': award['Recipient Name'] || 'N/A',
    'Awarding Agency': award['Awarding Agency'] || 'N/A',
    'Funding Agency': award['Funding Agency'] || 'N/A',
    'State': award['Place of Performance State'] || 'N/A',
    'Award Amount': award['Award Amount'] || 0,
    'Start Date': award['Start Date'] || '',
    'End Date': award['End Date'] || '',
    'Total Score': award.score?.total ?? '',
    'Environmental Score': award.score?.environmental ?? '',
    'Competitive Bidding Score': award.score?.competitiveBidding ?? '',
    'Modification Auth Score': award.score?.modificationAuth ?? '',
    'Score Breakdown': award.score 
      ? `E:${award.score.environmental}/100 | CB:${award.score.competitiveBidding}/100 | MA:${award.score.modificationAuth}/100`
      : '',
  }))
}

/**
 * Generate CSV string from award data
 */
export function generateCSV(awards: ExportAward[]): string {
  const exportData = transformForExport(awards)
  
  if (exportData.length === 0) {
    return ''
  }
  
  const headers = Object.keys(exportData[0])
  const csvRows: string[] = []
  
  // Add header row
  csvRows.push(headers.join(','))
  
  // Add data rows
  for (const row of exportData) {
    const values = headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

/**
 * Generate Excel workbook from award data
 * Returns buffer
 */
export function generateExcel(awards: ExportAward[], filterStats?: {
  totalCount: number
  totalSpending: number
  avgScore: number
  filters: Record<string, string>
}): Buffer {
  const exportData = transformForExport(awards)
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  
  // Projects sheet
  const projectsSheet = XLSX.utils.json_to_sheet(exportData)
  
  // Set column widths
  projectsSheet['!cols'] = [
    { wch: 20 }, // Award ID
    { wch: 50 }, // Project Name
    { wch: 30 }, // Recipient
    { wch: 30 }, // Awarding Agency
    { wch: 30 }, // Funding Agency
    { wch: 10 }, // State
    { wch: 15 }, // Award Amount
    { wch: 12 }, // Start Date
    { wch: 12 }, // End Date
    { wch: 12 }, // Total Score
    { wch: 18 }, // Environmental Score
    { wch: 22 }, // Competitive Bidding Score
    { wch: 22 }, // Modification Auth Score
    { wch: 40 }, // Score Breakdown
  ]
  
  XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects')
  
  // Summary sheet if filter stats provided
  if (filterStats) {
    const summaryData = [
      ['SFDAN Export Summary', ''],
      ['Export Date', new Date().toISOString()],
      ['', ''],
      ['Filter Statistics', ''],
      ['Total Records', filterStats.totalCount.toString()],
      ['Total Spending', `$${filterStats.totalSpending.toLocaleString()}`],
      ['Average Score', filterStats.avgScore.toString()],
      ['', ''],
      ['Applied Filters', ''],
      ...Object.entries(filterStats.filters).map(([key, value]) => [key, value]),
    ]
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  }
  
  // Write to buffer
  return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
}
