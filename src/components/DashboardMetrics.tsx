// src/components/DashboardMetrics.tsx
'use client'

interface Metrics {
  totalSpending: number
  projectCount: number
  avgScore: number
}

interface DashboardMetricsProps {
  metrics: Metrics
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-500 mb-1">Total Spending</div>
        <div className="text-2xl font-bold text-green-700">
          {metrics.totalSpending >= 1000000000
            ? `$${(metrics.totalSpending / 1000000000).toFixed(1)}B`
            : metrics.totalSpending >= 1000000
            ? `$${(metrics.totalSpending / 1000000).toFixed(1)}M`
            : `$${(metrics.totalSpending / 1000).toFixed(0)}K`}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-500 mb-1">Project Count</div>
        <div className="text-2xl font-bold text-blue-700">
          {metrics.projectCount.toLocaleString()}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-500 mb-1">Average Score</div>
        <div className="text-2xl font-bold text-purple-700">
          {metrics.avgScore}
        </div>
      </div>
    </div>
  )
}
