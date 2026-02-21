'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScoreDistribution {
  green: number;
  yellow: number;
  red: number;
}

export interface AgencyStatsData {
  agencyName: string;
  totalSpending: number;
  projectCount: number;
  avgScore: number;
  scoreDistribution: ScoreDistribution;
}

interface AgencyChartProps {
  agencyStats: AgencyStatsData[];
}

/**
 * Get color based on average score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
}

/**
 * Format currency for tooltip
 */
function formatCurrency(amount: number): string {
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  }
  return `$${(amount / 1e3).toFixed(0)}K`;
}

/**
 * Custom tooltip for the bar chart
 */
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: AgencyStatsData }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-900 mb-2">{data.agencyName}</p>
        <div className="space-y-1">
          <p className="text-gray-600">
            Total Spending: <span className="font-medium text-gray-900">{formatCurrency(data.totalSpending)}</span>
          </p>
          <p className="text-gray-600">
            Projects: <span className="font-medium text-gray-900">{data.projectCount}</span>
          </p>
          <p className="text-gray-600">
            Avg. Score: <span className="font-medium" style={{ color: getScoreColor(data.avgScore) }}>{data.avgScore}</span>
          </p>
          <div className="pt-2 mt-2 border-t border-gray-200">
            <p className="text-gray-500 text-xs">Score Distribution:</p>
            <div className="flex gap-2 mt-1">
              <span className="text-green-600">● {data.scoreDistribution.green}</span>
              <span className="text-yellow-600">● {data.scoreDistribution.yellow}</span>
              <span className="text-red-600">● {data.scoreDistribution.red}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function AgencyChart({ agencyStats }: AgencyChartProps) {
  // Take top 10 agencies by total spending
  const chartData = agencyStats.slice(0, 10).map(stat => ({
    ...stat,
    displayName: stat.agencyName.length > 20 
      ? stat.agencyName.substring(0, 17) + '...'
      : stat.agencyName
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No agency data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Agency Comparison - Top 10 by Spending
      </h3>
      <div className="w-full h-80" role="img" aria-label="Bar chart comparing agency compliance scores and spending">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="displayName"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="totalSpending"
              name="Total Spending"
              radius={[4, 4, 0, 0]}
              aria-label="Total spending by agency"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getScoreColor(entry.avgScore)}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="avgScore"
              name="Avg Score"
              fill="#9ca3af"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-600">High (≥80)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-gray-600">Medium (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-600">Low (&lt;60)</span>
        </div>
      </div>
    </div>
  );
}
