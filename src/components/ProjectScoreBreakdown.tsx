// src/components/ProjectScoreBreakdown.tsx
'use client'

import { ScoreBreakdown } from '@/lib/scoring'

interface ProjectScoreBreakdownProps {
  score: ScoreBreakdown
}

// Component weights as percentages
const COMPONENT_WEIGHTS = {
  environmental: 40,
  competitiveBidding: 35,
  modificationAuth: 25,
}

const componentInfo = {
  environmental: {
    name: 'Environmental Review',
    shortName: 'Environmental',
    description: 'NEPA compliance indicators - evaluates whether the project is likely subject to environmental review requirements',
    citation: '42 U.S.C. §4321 (NEPA)',
  },
  competitiveBidding: {
    name: 'Competitive Bidding',
    shortName: 'Competition',
    description: 'Competition requirements under 2 CFR 200 - evaluates the competitive nature of the award',
    citation: '2 CFR 200.319',
  },
  modificationAuth: {
    name: 'Modification Authorization',
    shortName: 'Oversight',
    description: 'Period of performance and change order approval process',
    citation: '2 CFR 200.309',
  },
}

function getScoreColor(score: number): { bg: string; text: string; border: string } {
  if (score >= 80) {
    return { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300' }
  }
  if (score >= 60) {
    return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-300' }
  }
  return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-300' }
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Moderate'
  return 'Limited'
}

export function ProjectScoreBreakdown({ score }: ProjectScoreBreakdownProps) {
  const components = [
    { key: 'environmental' as const, value: score.environmental, weight: COMPONENT_WEIGHTS.environmental, info: componentInfo.environmental },
    { key: 'competitiveBidding' as const, value: score.competitiveBidding, weight: COMPONENT_WEIGHTS.competitiveBidding, info: componentInfo.competitiveBidding },
    { key: 'modificationAuth' as const, value: score.modificationAuth, weight: COMPONENT_WEIGHTS.modificationAuth, info: componentInfo.modificationAuth },
  ]

  return (
    <div className="space-y-6">
      {/* Total Score */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Total Score</h3>
          <p className="text-sm text-gray-500">Weighted average of all components</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(score.total).text}`}>
            {score.total}
          </div>
          <div className="text-sm text-gray-500">out of 100</div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="space-y-4">
        {components.map(({ key, value, weight, info }) => {
          const colors = getScoreColor(value)
          
          return (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{info.name}</h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {weight}%
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${colors.text}`}>{value}</span>
                  <span className="text-sm text-gray-400 ml-1">/ 100</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute h-full ${colors.bg} transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{getScoreLabel(value)} indicators</span>
                <span className="text-gray-400">{info.citation}</span>
              </div>
              
              {/* Tooltip/Description */}
              <details className="mt-2">
                <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                  What does this measure?
                </summary>
                <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">
                  {info.description}
                </p>
              </details>
            </div>
          )
        })}
      </div>

      {/* Score Explanation */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-2">Score Explanation</h4>
        <p className="text-sm text-blue-800">
          {score.environmental >= 80 && 'This project shows strong environmental review indicators, suggesting it is likely subject to NEPA requirements. '}
          {score.environmental < 80 && score.environmental >= 60 && 'This project has moderate environmental review indicators. '}
          {score.environmental < 60 && 'This project has limited environmental review indicators in the available data. '}
          
          {score.competitiveBidding >= 70 && 'The award structure indicates competitive bidding processes. '}
          {score.competitiveBidding < 70 && score.competitiveBidding >= 50 && 'The award shows some competitive elements. '}
          {score.competitiveBidding < 50 && 'The award may be non-competitive or formula-based. '}
          
          {score.modificationAuth >= 70 && 'The project has defined period of performance with proper oversight parameters.'}
          {score.modificationAuth < 70 && score.modificationAuth >= 50 && 'The project has partial oversight parameters defined.'}
          {score.modificationAuth < 50 && 'Limited oversight period information available in the data.'}
        </p>
      </div>
    </div>
  )
}
