// src/components/DashboardMetrics.tsx
'use client'

import { Card } from '@tremor/react'

interface SummaryMetrics {
  totalSpending: number
  projectCount: number
  avgScore: number
}

interface DashboardMetricsProps {
  metrics: SummaryMetrics
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`
    }
    if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`
    }
    return `$${(amount / 1e3).toFixed(0)}K`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'High procedural compliance'
    if (score >= 60) return 'Medium compliance - review recommended'
    return 'Low compliance - investigation suggested'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Spending */}
      <Card className="bg-white">
        <p className="text-sm text-gray-600">Total Spending</p>
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(metrics.totalSpending)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Across {metrics.projectCount.toLocaleString()} projects
        </p>
      </Card>

      {/* Project Count */}
      <Card className="bg-white">
        <p className="text-sm text-gray-600">Projects Analyzed</p>
        <p className="text-2xl font-semibold text-gray-900">
          {metrics.projectCount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          IIJA infrastructure awards
        </p>
      </Card>

      {/* Average Score */}
      <Card className="bg-white">
        <p className="text-sm text-gray-600">Avg. Compliance Score</p>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-semibold ${getScoreColor(metrics.avgScore)}`}>
            {metrics.avgScore}
          </p>
          <p className="text-gray-500">/ 100</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {getScoreDescription(metrics.avgScore)}
        </p>
      </Card>
    </div>
  )
}
