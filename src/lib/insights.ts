import { createHash } from 'crypto'

export type InsightTriggerType = 'cadence' | 'threshold'
export type InsightRiskLevel = 'low' | 'medium' | 'high'

export interface InsightDraft {
  type: string
  title: string
  summary: string
  metrics: Record<string, any>
  evidence: Record<string, any>
  trigger_type: InsightTriggerType
  risk_level: InsightRiskLevel
  auto_publish_eligible: boolean
  fingerprint: string
  period_start?: string
  period_end?: string
}

export interface InsightOptions {
  thresholdPercent?: number
  cadence?: 'weekly' | 'monthly'
  periodStart?: string
  periodEnd?: string
}

interface NormalizedAward {
  id: string
  amount: number
  score: number | null
  startDate: string | null
  recipient: string | null
  fundingAgency: string | null
  state: string | null
}

const DEFAULT_THRESHOLD_PERCENT = 25

function toDateValue(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().split('T')[0]
}

function normalizeAwards(awards: Array<Record<string, any>>): NormalizedAward[] {
  return awards.map(award => ({
    id: String(award['Award ID'] ?? award.award_id ?? award.id ?? ''),
    amount: Number(award['Award Amount'] ?? award.award_amount ?? 0) || 0,
    score: typeof award?.score?.total === 'number' ? award.score.total : null,
    startDate: toDateValue(award['Start Date'] ?? award.start_date ?? award.date),
    recipient: award['Recipient Name'] ?? award.recipient_name ?? null,
    fundingAgency: award['Funding Agency'] ?? award.funding_agency ?? null,
    state: award['Place of Performance State'] ?? award.recipient_state ?? null,
  }))
}

function getPeriodFromAwards(awards: NormalizedAward[], options?: InsightOptions) {
  const dates = awards
    .map(award => award.startDate)
    .filter((date): date is string => Boolean(date))
    .sort()

  const period_start = options?.periodStart ?? dates[0] ?? toDateValue(new Date().toISOString())
  const period_end = options?.periodEnd ?? dates[dates.length - 1] ?? toDateValue(new Date().toISOString())

  return { period_start, period_end }
}

function createFingerprint(parts: Array<string | number | null | undefined>): string {
  const raw = parts.filter(Boolean).join('|')
  return createHash('sha256').update(raw).digest('hex')
}

function buildOutlierInsights(awards: NormalizedAward[], period: { period_start?: string; period_end?: string }): InsightDraft[] {
  const scored = awards.filter(award => typeof award.score === 'number')
  if (scored.length < 10) return []

  const sorted = [...scored].sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  const sliceSize = Math.max(1, Math.floor(sorted.length * 0.05))
  const lowOutliers = sorted.slice(0, sliceSize)
  const highOutliers = sorted.slice(-sliceSize)

  const lowInsight: InsightDraft = {
    type: 'score_outliers_low',
    title: 'Low integrity score outliers',
    summary: `Bottom ${sliceSize} projects fall below typical integrity scores in this period.`,
    metrics: {
      percentile: 5,
      count: lowOutliers.length,
      minScore: Math.min(...lowOutliers.map(outlier => outlier.score ?? 0)),
      maxScore: Math.max(...lowOutliers.map(outlier => outlier.score ?? 0)),
    },
    evidence: {
      sample: lowOutliers.slice(0, 5).map(outlier => ({
        id: outlier.id,
        amount: outlier.amount,
        score: outlier.score,
        recipient: outlier.recipient,
        fundingAgency: outlier.fundingAgency,
      })),
    },
    trigger_type: 'cadence',
    risk_level: 'medium',
    auto_publish_eligible: false,
    fingerprint: createFingerprint(['score_outliers_low', period.period_start, period.period_end, sliceSize]),
    ...period,
  }

  const highInsight: InsightDraft = {
    type: 'score_outliers_high',
    title: 'High integrity score outliers',
    summary: `Top ${sliceSize} projects exceed typical integrity scores in this period.`,
    metrics: {
      percentile: 95,
      count: highOutliers.length,
      minScore: Math.min(...highOutliers.map(outlier => outlier.score ?? 0)),
      maxScore: Math.max(...highOutliers.map(outlier => outlier.score ?? 0)),
    },
    evidence: {
      sample: highOutliers.slice(0, 5).map(outlier => ({
        id: outlier.id,
        amount: outlier.amount,
        score: outlier.score,
        recipient: outlier.recipient,
        fundingAgency: outlier.fundingAgency,
      })),
    },
    trigger_type: 'cadence',
    risk_level: 'medium',
    auto_publish_eligible: false,
    fingerprint: createFingerprint(['score_outliers_high', period.period_start, period.period_end, sliceSize]),
    ...period,
  }

  return [lowInsight, highInsight]
}

function buildSpendingConcentrationInsight(
  awards: NormalizedAward[],
  period: { period_start?: string; period_end?: string }
): InsightDraft[] {
  const totalsByAgency = awards.reduce<Record<string, number>>((acc, award) => {
    const agency = award.fundingAgency || 'Unknown'
    acc[agency] = (acc[agency] || 0) + award.amount
    return acc
  }, {})

  const totalSpending = Object.values(totalsByAgency).reduce((sum, value) => sum + value, 0)
  if (totalSpending <= 0) return []

  const topAgencies = Object.entries(totalsByAgency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({
      name,
      amount,
      share: Number(((amount / totalSpending) * 100).toFixed(2)),
    }))

  const topShare = topAgencies.reduce((sum, agency) => sum + agency.share, 0)

  return [
    {
      type: 'spending_concentration',
      title: 'Spending concentration by agency',
      summary: `Top agencies account for ${topShare.toFixed(1)}% of total spending in this period.`,
      metrics: {
        totalSpending,
        topAgencies,
      },
      evidence: {
        topAgencyNames: topAgencies.map(agency => agency.name),
      },
      trigger_type: 'cadence',
      risk_level: 'low',
      auto_publish_eligible: true,
      fingerprint: createFingerprint(['spending_concentration', period.period_start, period.period_end, topAgencies.map(a => a.name).join(',')]),
      ...period,
    },
  ]
}

function buildMonthOverMonthInsight(
  awards: NormalizedAward[],
  period: { period_start?: string; period_end?: string },
  thresholdPercent: number
): InsightDraft[] {
  const totalsByMonth = awards.reduce<Record<string, number>>((acc, award) => {
    if (!award.startDate) return acc
    const month = award.startDate.slice(0, 7)
    acc[month] = (acc[month] || 0) + award.amount
    return acc
  }, {})

  const months = Object.keys(totalsByMonth).sort()
  if (months.length < 2) return []

  const currentMonth = months[months.length - 1]
  const previousMonth = months[months.length - 2]
  const currentTotal = totalsByMonth[currentMonth] || 0
  const previousTotal = totalsByMonth[previousMonth] || 0

  if (previousTotal === 0 && currentTotal === 0) return []

  const percentChange = previousTotal === 0
    ? 100
    : ((currentTotal - previousTotal) / previousTotal) * 100

  const trigger_type: InsightTriggerType = Math.abs(percentChange) >= thresholdPercent ? 'threshold' : 'cadence'
  const changeDirection = percentChange >= 0 ? 'increase' : 'decrease'
  const summary = `Spending shows a ${Math.abs(percentChange).toFixed(1)}% ${changeDirection} from ${previousMonth} to ${currentMonth}.`

  return [
    {
      type: 'month_over_month_change',
      title: 'Month-over-month spending change',
      summary,
      metrics: {
        previousMonth,
        currentMonth,
        previousTotal,
        currentTotal,
        percentChange: Number(percentChange.toFixed(2)),
        thresholdPercent,
      },
      evidence: {
        monthCount: months.length,
      },
      trigger_type,
      risk_level: 'medium',
      auto_publish_eligible: false,
      fingerprint: createFingerprint(['month_over_month_change', previousMonth, currentMonth, percentChange.toFixed(2)]),
      ...period,
    },
  ]
}

export function generateInsights(
  awards: Array<Record<string, any>>,
  options: InsightOptions = {}
): InsightDraft[] {
  const thresholdPercent = options.thresholdPercent ?? DEFAULT_THRESHOLD_PERCENT
  const normalized = normalizeAwards(awards)
  const period = getPeriodFromAwards(normalized, options)

  return [
    ...buildOutlierInsights(normalized, period),
    ...buildSpendingConcentrationInsight(normalized, period),
    ...buildMonthOverMonthInsight(normalized, period, thresholdPercent),
  ]
}
