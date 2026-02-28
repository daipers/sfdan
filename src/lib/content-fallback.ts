export type FallbackContentPost = {
  id: string
  slug: string
  title: string
  summary: string | null
  sections: {
    executiveSummary?: string
    keyFindings?: string[]
    methodology?: string
    dataHighlights?: Array<{ label: string; value: string; note?: string }>
    citations?: string[]
    dataSources?: string[]
    contentType?: string
    tags?: string[]
    agencies?: string[]
    states?: string[]
  } | null
  insight_ids: string[] | null
  status: 'published'
  is_gated: boolean
  data_sources: Record<string, unknown> | null
  published_at: string | null
  approved_at: string | null
  approved_by: string | null
  created_at: string | null
  updated_at: string | null
}

const TODAY = new Date().toISOString().split('T')[0]

export const fallbackContent: FallbackContentPost[] = [
  {
    id: 'fallback-sample-insight',
    slug: 'sample-insight',
    title: 'Sample Insight: Procurement Risk Signals',
    summary:
      'A preview of how compliance signals surface potential procurement risks in federally funded projects.',
    sections: {
      executiveSummary:
        'This sample insight highlights how competitive bidding, environmental reviews, and contract changes combine to shape project integrity scores.',
      keyFindings: [
        'Competitive bidding signals align with higher integrity outcomes.',
        'Late-stage contract modifications correlate with higher procedural risk.',
      ],
      methodology: 'Signals are normalized across award metadata and weighted to produce an integrity score.',
      dataHighlights: [
        { label: 'Awards Reviewed', value: '128' },
        { label: 'Average Integrity Score', value: '74' },
      ],
      citations: ['2 CFR 200.320 Competitive Procurement Requirements'],
      dataSources: ['USASpending.gov API v2'],
      contentType: 'Insight',
      tags: ['preview', 'procurement'],
      agencies: ['Department of Transportation'],
      states: ['CA', 'TX'],
    },
    insight_ids: null,
    status: 'published',
    is_gated: false,
    data_sources: null,
    published_at: TODAY,
    approved_at: TODAY,
    approved_by: 'system',
    created_at: TODAY,
    updated_at: TODAY,
  },
  {
    id: 'fallback-infrastructure-analysis',
    slug: 'infrastructure-analysis',
    title: 'Infrastructure Analysis: Funding Concentration',
    summary:
      'Snapshot of funding concentration trends across transportation and energy awards during the IIJA period.',
    sections: {
      executiveSummary:
        'Funding concentration analysis surfaces geographic clusters where infrastructure investments are accelerating.',
      keyFindings: [
        'Top five states account for more than half of active awards.',
        'Transportation programs drive the largest award sizes.',
      ],
      methodology: 'Aggregated award totals by state and agency from public award metadata.',
      dataHighlights: [
        { label: 'States Analyzed', value: '12' },
        { label: 'Total Observed Funding', value: '$4.2B' },
      ],
      citations: ['IIJA implementation guidance'],
      dataSources: ['USASpending.gov API v2'],
      contentType: 'Analysis',
      tags: ['infrastructure', 'funding'],
      agencies: ['Department of Energy'],
      states: ['WA', 'NY'],
    },
    insight_ids: null,
    status: 'published',
    is_gated: false,
    data_sources: null,
    published_at: TODAY,
    approved_at: TODAY,
    approved_by: 'system',
    created_at: TODAY,
    updated_at: TODAY,
  },
  {
    id: 'fallback-compliance-report',
    slug: 'compliance-report',
    title: 'Compliance Report: Reporting Discipline',
    summary:
      'Preview report on reporting discipline and data transparency across major federal infrastructure awards.',
    sections: {
      executiveSummary:
        'Clear reporting disciplines reduce procedural uncertainty and improve audit readiness.',
      keyFindings: [
        'Consistent reporting is linked with higher integrity scores.',
        'Missing reporting fields are concentrated in a small number of agencies.',
      ],
      methodology: 'Reviewed reporting cadence and completeness across award metadata.',
      dataHighlights: [
        { label: 'Agencies Reviewed', value: '5' },
        { label: 'Reporting Completeness', value: '82%' },
      ],
      citations: ['OMB M-22-09', '2 CFR 200.328 Performance and Financial Reporting'],
      dataSources: ['USASpending.gov API v2'],
      contentType: 'Report',
      tags: ['compliance', 'reporting'],
      agencies: ['Environmental Protection Agency'],
      states: ['FL', 'GA'],
    },
    insight_ids: null,
    status: 'published',
    is_gated: true,
    data_sources: null,
    published_at: TODAY,
    approved_at: TODAY,
    approved_by: 'system',
    created_at: TODAY,
    updated_at: TODAY,
  },
]

export function getFallbackContentBySlug(slug: string): FallbackContentPost | null {
  return fallbackContent.find((post) => post.slug === slug) || null
}
