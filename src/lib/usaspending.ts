import { calculateScore, ScoreBreakdown } from './scoring';

// USASpending.gov API client
// API v2 Documentation: https://github.com/fedspendingtransparency/usaspending-api/blob/master/docs/API.md

const USASPENDING_API_BASE = 'https://api.usaspending.gov/api/v2';

// IIJA-specific funding agencies (Department of Transportation, Energy, EPA, HUD, Agriculture)
const IIJA_AGENCIES = [
  'Department of Transportation',
  'Department of Energy',
  'Environmental Protection Agency',
  'Department of Housing and Urban Development',
  'Department of Agriculture',
];

// Default time period: Nov 2021 (IIJA signed) to present
const DEFAULT_TIME_PERIOD = {
  start_date: '2021-11-15',
  end_date: new Date().toISOString().split('T')[0],
};

export interface AwardSearchResult {
  results: any[];
  page_metadata: {
    page: number;
    count: number;
    total: number;
    page_size: number;
  };
}

export interface LastUpdatedResponse {
  last_updated: string;
  certification_date: string;
}

/**
 * Fetch awards from USASpending.gov with IIJA-specific filters
 */
export async function fetchAwards(
  filters?: {
    timePeriod?: { start_date: string; end_date: string };
    agencies?: string[];
    page?: number;
    pageSize?: number;
  }
): Promise<AwardSearchResult> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 50;

  const payload = {
    filters: {
      time_period: [filters?.timePeriod || DEFAULT_TIME_PERIOD],
      agencies: filters?.agencies?.map(name => ({
        type: 'funding',
        tier: 'toptier',
        name,
      })) || IIJA_AGENCIES.map(name => ({
        type: 'funding',
        tier: 'toptier',
        name,
      })),
      assistance_type: [3, 4, 5], // 3=Grants, 4=Cooperative Agreements, 5=Loans
      award_type_codes: ['A', 'B', 'C', 'D'], // A=Contracts, B=Grants, C=Cooperative Agreements, D=Loans
    },
    pagination: {
      page,
      count: pageSize,
    },
    fields: [
      'Award ID',
      'Description',
      'Recipient Name',
      'Awarding Agency',
      'Funding Agency',
      'Award Amount',
      'Start Date',
      'End Date',
      'Award Type',
      'Assistance Type',
    ],
    sort: 'Award Amount',
    order: 'desc',
  };

  const response = await fetch(`${USASPENDING_API_BASE}/search/spending_by_award/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    next: { revalidate: 3600 }, // Cache for 1 hour at Vercel edge
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`USASpending API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Add scoring to each award
  if (data.results && Array.isArray(data.results)) {
    data.results = data.results.map((award: any) => {
      // Map API fields to scoring engine expected format
      const awardForScoring = {
        'Award ID': award['Award ID'],
        'Description': award['Description'],
        'Recipient Name': award['Recipient Name'],
        'Awarding Agency': award['Awarding Agency'],
        'Funding Agency': award['Funding Agency'],
        'Award Amount': award['Award Amount'],
        'Start Date': award['Start Date'],
        'End Date': award['End Date'],
        awardType: award['Award Type'],
        assistanceType: award['Assistance Type'],
      };
      
      const score = calculateScore(awardForScoring);
      return {
        ...award,
        score
      };
    });
  }
  
  return data;
}

/**
 * Fetch details for a specific award
 */
export async function fetchAwardDetails(awardId: string): Promise<any> {
  const response = await fetch(`${USASPENDING_API_BASE}/awards/${awardId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`USASpending API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Fetch the last updated date from USASpending.gov
 */
export async function fetchLastUpdated(): Promise<string | null> {
  try {
    const response = await fetch(`${USASPENDING_API_BASE}/awards/last_updated/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return null;
    }

    const data: LastUpdatedResponse = await response.json();
    return data.last_updated || data.certification_date || null;
  } catch (error) {
    console.error('Error fetching last updated:', error);
    return null;
  }
}
