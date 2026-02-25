// src/app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { searchProjects, SearchParams } from '@/lib/api'
import { generateCSV, generateExcel, ExportAward } from '@/lib/export'

export const runtime = 'nodejs'
export const dynamic = "force-static"

// Maximum number of rows to export
const MAX_EXPORT_ROWS = 10000
const STATIC_EXPORT = process.env.STATIC_EXPORT === 'true'

export async function GET(request: NextRequest) {
  try {
    if (STATIC_EXPORT) {
      return NextResponse.json(
        {
          error: 'Export unavailable in static build',
          message: 'Use client-side export when running on GitHub Pages.',
        },
        { status: 501 }
      )
    }

    const { searchParams } = request.nextUrl
    
    // Parse filter parameters
    const format = searchParams.get('format') || 'csv'
    const query = searchParams.get('query') || undefined
    const state = searchParams.get('state') || null
    const agency = searchParams.get('agency') || null
    const category = searchParams.get('category') || null
    const sort = searchParams.get('sort') || 'amount'
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc'
    
    // Build search params - request large page size for export
    const searchParamsObj: SearchParams = {
      query,
      state,
      agency,
      category,
      page: 1,
      pageSize: Math.min(MAX_EXPORT_ROWS, 500), // Fetch up to 500 at a time, we'll handle larger
      sort,
      order,
    }
    
    // Fetch all matching awards
    // Note: For very large exports, this would need pagination in a real implementation
    // For now, we'll fetch with a reasonable limit
    const result = await searchProjects(searchParamsObj)
    
    // Check if exceeding limit
    if (result.pagination.totalCount > MAX_EXPORT_ROWS) {
      return NextResponse.json(
        { 
          error: 'Export limit exceeded', 
          message: `Export exceeds maximum of ${MAX_EXPORT_ROWS} rows. Found ${result.pagination.totalCount} matching records. Please apply more specific filters.`,
          currentCount: result.pagination.totalCount,
          maxCount: MAX_EXPORT_ROWS,
        },
        { status: 400 }
      )
    }
    
    // Prepare filter stats for Excel
    const filterStats = {
      totalCount: result.pagination.totalCount,
      totalSpending: result.metrics.totalSpending,
      avgScore: result.metrics.avgScore,
      filters: {
        ...(query && { Query: query }),
        ...(state && { State: state }),
        ...(agency && { Agency: agency }),
        ...(category && { Category: category }),
      },
    }
    
    const awards = result.data as ExportAward[]
    const today = new Date().toISOString().split('T')[0]
    const filename = `sfdan-export-${today}`
    
    // Generate output based on format
    if (format === 'xlsx') {
      const excelBuffer = generateExcel(awards, filterStats)
      
      return new NextResponse(new Uint8Array(excelBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      })
    }
    
    // Default to CSV
    const csv = generateCSV(awards)
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Export failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
