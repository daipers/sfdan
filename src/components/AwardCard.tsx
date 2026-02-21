'use client';

import { ScoreBreakdown, getScoreColorClass, getScoreDescription, getScoreExplanation } from '@/lib/scoring';

interface AwardCardProps {
  award: {
    'Award ID': string;
    'Description'?: string;
    'Recipient Name'?: string;
    'Awarding Agency'?: string;
    'Funding Agency'?: string;
    'Award Amount'?: number;
    'Start Date'?: string;
    'End Date'?: string;
    score?: ScoreBreakdown;
  };
}

export function AwardCard({ award }: AwardCardProps) {
  const score = award.score;
  const hasScore = score && typeof score.total === 'number';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg line-clamp-2 flex-1">
          {award['Description'] || award['Award ID'] || 'Untitled Award'}
        </h3>
        {hasScore && (
          <div className="ml-2 flex flex-col items-end">
            <div 
              className={`px-2 py-1 rounded-full text-sm font-bold border ${getScoreColorClass(score.total)}`}
              title={getScoreExplanation(score)}
            >
              {score.total}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {getScoreDescription(score.total)}
            </span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {award['Recipient Name'] || 'Unknown Recipient'}
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-700">
            ${(award['Award Amount'] || 0).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {award['Awarding Agency'] || 'N/A'}
          </span>
        </div>
        
        {/* Score Breakdown - shown on hover or always visible for transparency */}
        {hasScore && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Score Breakdown</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">Environmental</div>
                <div className={score.environmental >= 70 ? 'text-green-600' : score.environmental >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                  {score.environmental}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Competition</div>
                <div className={score.competitiveBidding >= 70 ? 'text-green-600' : score.competitiveBidding >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                  {score.competitiveBidding}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Oversight</div>
                <div className={score.modificationAuth >= 70 ? 'text-green-600' : score.modificationAuth >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                  {score.modificationAuth}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Period of Performance */}
        {(award['Start Date'] || award['End Date']) && (
          <div className="text-xs text-gray-500 mt-2">
            {award['Start Date'] && `Started: ${new Date(award['Start Date']).toLocaleDateString()}`}
            {award['Start Date'] && award['End Date'] && ' — '}
            {award['End Date'] && `Ends: ${new Date(award['End Date']).toLocaleDateString()}`}
          </div>
        )}
      </div>
    </div>
  );
}
