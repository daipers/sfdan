/**
 * Agency Statistics API Endpoint
 * 
 * Returns aggregated statistics by federal agency for comparison charts.
 */

import { NextResponse } from 'next/server';
import { fetchAwards } from '@/lib/usaspending';
import { calculateAgencyStats, AgencyStats } from '@/lib/agency-stats';

// Cache for agency stats
let cachedStats: { data: AgencyStats[]; timestamp: number } | null = null;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

/**
 * GET /api/agency-stats
 * Returns agency-level statistics for comparison charts
 */
export async function GET() {
  try {
    // Check cache
    if (cachedStats && Date.now() - cachedStats.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedStats.data);
    }

    // Fetch a larger dataset for aggregation (500 awards)
    const data = await fetchAwards({
      page: 1,
      pageSize: 500
    });

    if (!data.results || data.results.length === 0) {
      return NextResponse.json([]);
    }

    // Calculate agency statistics
    const agencyStats = calculateAgencyStats(data.results);

    // Update cache
    cachedStats = {
      data: agencyStats,
      timestamp: Date.now()
    };

    return NextResponse.json(agencyStats);
  } catch (error) {
    console.error('Error fetching agency stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency statistics' },
      { status: 500 }
    );
  }
}
