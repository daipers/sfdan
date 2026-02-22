// src/components/AdminInsightsTable.tsx
'use client'

import { useState } from 'react'

interface InsightItem {
  id: string
  title: string
  summary: string
  type: string
  risk_level?: string | null
  trigger_type?: string | null
  auto_publish_eligible?: boolean | null
  generated_at?: string | null
}

interface AdminInsightsTableProps {
  insights: InsightItem[]
  adminEmail: string
}

export function AdminInsightsTable({ insights, adminEmail }: AdminInsightsTableProps) {
  const [items, setItems] = useState(insights)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (insightId: string) => {
    setLoadingId(insightId)
    setError(null)

    try {
      const response = await fetch('/api/insights/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ id: insightId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Approval failed')
      }

      setItems((prev) => prev.filter((item) => item.id !== insightId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve insight')
    } finally {
      setLoadingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
        No pending insights to review right now.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {items.map((insight) => (
        <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="uppercase tracking-wide text-blue-600 font-semibold">
                  {insight.type}
                </span>
                {insight.risk_level && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {insight.risk_level} risk
                  </span>
                )}
                {insight.trigger_type && (
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {insight.trigger_type}
                  </span>
                )}
                {insight.auto_publish_eligible && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                    Auto-publish eligible
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{insight.summary}</p>
              {insight.generated_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Generated {new Date(insight.generated_at).toLocaleDateString('en-US')}
                </p>
              )}
            </div>
            <button
              onClick={() => handleApprove(insight.id)}
              disabled={loadingId === insight.id}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loadingId === insight.id ? 'Publishing...' : 'Approve & Publish'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
