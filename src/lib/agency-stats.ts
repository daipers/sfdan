/**
 * Agency Statistics Aggregation
 * 
 * Calculates aggregate statistics for federal agencies based on award data.
 * Used for agency comparison charts on the dashboard.
 */

import { calculateScore, ScoreBreakdown } from './scoring';

export interface AgencyStats {
  agencyName: string;
  totalSpending: number;
  projectCount: number;
  avgScore: number;
  scoreDistribution: {
    green: number;  // >= 80
    yellow: number; // >= 60, < 80
    red: number;    // < 60
  };
}

interface AwardWithScore {
  'Award ID': string;
  'Awarding Agency'?: string;
  'Funding Agency'?: string;
  'Award Amount'?: number;
  score?: ScoreBreakdown;
}

/**
 * Calculate agency-level statistics from award data
 * 
 * @param awards - Array of award objects with scoring
 * @returns Array of AgencyStats sorted by totalSpending descending
 */
export function calculateAgencyStats(awards: AwardWithScore[]): AgencyStats[] {
  const agencyMap = new Map<string, AgencyStats>();
  
  for (const award of awards) {
    // Use Awarding Agency as primary grouping key
    const agencyName = award['Awarding Agency'] || 'Unknown';
    
    if (!agencyMap.has(agencyName)) {
      agencyMap.set(agencyName, {
        agencyName,
        totalSpending: 0,
        projectCount: 0,
        avgScore: 0,
        scoreDistribution: {
          green: 0,
          yellow: 0,
          red: 0
        }
      });
    }
    
    const stats = agencyMap.get(agencyName)!;
    
    // Aggregate spending
    const amount = award['Award Amount'] || 0;
    stats.totalSpending += amount;
    stats.projectCount += 1;
    
    // Calculate score distribution
    const score = award.score?.total || 0;
    if (score >= 80) {
      stats.scoreDistribution.green++;
    } else if (score >= 60) {
      stats.scoreDistribution.yellow++;
    } else {
      stats.scoreDistribution.red++;
    }
  }
  
  // Calculate average scores
  const agencyArray = Array.from(agencyMap.values());
  
  for (const stats of agencyArray) {
    // Calculate average by summing individual scores and dividing
    // We'll need to track the sum differently - let's recalculate
  }
  
  // Better approach: recalculate avgScore from the actual scores
  const agencyStatsWithAvg: AgencyStats[] = [];
  
  for (const [agencyName, _stats] of agencyMap) {
    // Re-iterate to calculate accurate average
    let totalScore = 0;
    let count = 0;
    let green = 0;
    let yellow = 0;
    let red = 0;
    let totalSpend = 0;
    
    for (const award of awards) {
      const awardAgency = award['Awarding Agency'] || 'Unknown';
      if (awardAgency === agencyName) {
        const score = award.score?.total || 0;
        totalScore += score;
        count++;
        totalSpend += award['Award Amount'] || 0;
        
        if (score >= 80) green++;
        else if (score >= 60) yellow++;
        else red++;
      }
    }
    
    agencyStatsWithAvg.push({
      agencyName,
      totalSpending: totalSpend,
      projectCount: count,
      avgScore: count > 0 ? Math.round(totalScore / count) : 0,
      scoreDistribution: { green, yellow, red }
    });
  }
  
  // Sort by total spending descending
  return agencyStatsWithAvg.sort((a, b) => b.totalSpending - a.totalSpending);
}

/**
 * Get color for bar based on score threshold
 */
export function getScoreBarColor(avgScore: number): string {
  if (avgScore >= 80) return '#22c55e'; // green-500
  if (avgScore >= 60) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
}

/**
 * Format currency for display
 */
export function formatAgencyCurrency(amount: number): string {
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  }
  return `$${(amount / 1e3).toFixed(0)}K`;
}
