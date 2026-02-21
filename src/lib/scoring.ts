/**
 * Procedural Compliance Scoring Engine
 * 
 * Evaluates IIJA projects on procedural compliance using federal regulatory requirements.
 * Based on: 2 CFR 200, Build America Buy America, Davis-Bacon Act
 * 
 * Scoring Components:
 * - Environmental Review (35%): NEPA compliance indicators
 * - Competitive Bidding (35%): Competition in award allocation
 * - Modification Authorization (30%): Oversight and period of performance
 */

export interface ScoreBreakdown {
  environmental: number;
  competitiveBidding: number;
  modificationAuth: number;
  total: number;
}

export interface ScoringRule {
  name: string;
  weight: number;
  evaluate: (award: AwardData) => number;
  citation: string;
}

// USASpending API award data shape
export interface AwardData {
  'Award ID': string;
  'Description'?: string;
  'Recipient Name'?: string;
  'Awarding Agency'?: string;
  'Funding Agency'?: string;
  'Award Amount'?: number;
  'Start Date'?: string;
  'End Date'?: string;
  // Additional fields that may be available
  assistanceListingType?: string;
  assistanceType?: string;
  awardType?: string;
  awardTypeCode?: string;
  periodOfPerformanceStartDate?: string;
  periodOfPerformanceEndDate?: string;
  transactionNumber?: string;
  federalFundsObligated?: number;
}

/**
 * Scoring Rules
 * 
 * Each rule evaluates an award and returns a score 0-100
 */

// Environmental Review Score (35% weight)
// Grants for construction/infrastructure typically require NEPA environmental review
// Higher score = more likely to have proper environmental review process
const environmentalReviewRule: ScoringRule = {
  name: 'Environmental Review',
  weight: 0.35,
  citation: '42 U.S.C. §4321 et seq. (NEPA); 2 CFR 200.329',
  evaluate: (award: AwardData): number => {
    const description = (award['Description'] || '').toLowerCase();
    const awardingAgency = (award['Awarding Agency'] || '').toLowerCase();
    
    // Infrastructure keywords indicating NEPA review likely required
    const infrastructureKeywords = [
      'highway', 'bridge', 'road', 'transportation', 'transit',
      'water', 'sewer', 'wastewater', 'storm', 'flood',
      'energy', 'power', 'grid', 'renewable', 'solar', 'wind',
      'building', 'construction', 'facility', 'infrastructure',
      'environmental', 'cleanup', 'remediation'
    ];
    
    const hasInfrastructureKeyword = infrastructureKeywords.some(
      kw => description.includes(kw) || awardingAgency.includes(kw)
    );
    
    // If it's likely a construction/infrastructure award, score higher
    // because NEPA review is typically required
    if (hasInfrastructureKeyword) {
      return 85;
    }
    
    // Default mid-range score for non-infrastructure awards
    // Some environmental review may still apply
    return 60;
  }
};

// Competitive Bidding Score (35% weight)
// Formula grants (A) are typically distributed by formula - lower competition
// Project grants (B) are competitive - higher competition
// Cooperative agreements (C) - moderate competition
const competitiveBiddingRule: ScoringRule = {
  name: 'Competitive Bidding',
  weight: 0.35,
  citation: '2 CFR 200.319 (Competition); 2 CFR 200.400-400',
  evaluate: (award: AwardData): number => {
    const awardTypeCode = award.awardTypeCode || award.awardType || '';
    const description = (award['Description'] || '').toLowerCase();
    const recipientName = (award['Recipient Name'] || '').toLowerCase();
    
    // Award type codes: A=Formula Grant, B=Project Grant, C=Cooperative Agreement, D=Loan
    // B (Project Grant) indicates competitive process
    if (awardTypeCode === 'B') {
      return 85;
    }
    
    // A (Formula Grant) - distributed by formula, less competitive
    if (awardTypeCode === 'A') {
      return 50;
    }
    
    // C (Cooperative Agreement) - some competitive elements
    if (awardTypeCode === 'C') {
      return 70;
    }
    
    // D (Loan) - different mechanism
    if (awardTypeCode === 'D') {
      return 65;
    }
    
    // Check description for competitive indicators
    const competitiveKeywords = ['competitive', 'solicitation', 'request for proposal', 'rfp'];
    const nonCompetitiveKeywords = ['formula', 'direct allocation', 'block grant', 'entitlement'];
    
    if (competitiveKeywords.some(kw => description.includes(kw))) {
      return 80;
    }
    
    if (nonCompetitiveKeywords.some(kw => description.includes(kw))) {
      return 45;
    }
    
    // Check if it's a known state/local government (typically formula)
    const stateLocalKeywords = ['county', 'city of', 'town of', 'state of', 'municipality'];
    if (stateLocalKeywords.some(kw => recipientName.includes(kw))) {
      return 55;
    }
    
    // Default mid-range - cannot determine from available data
    return 60;
  }
};

// Modification Authorization Score (30% weight)
// Proper period of performance and funding oversight indicators
const modificationAuthRule: ScoringRule = {
  name: 'Modification Authorization',
  weight: 0.30,
  citation: '2 CFR 200.309 (Period of Performance); 2 CFR 200.403-405',
  evaluate: (award: AwardData): number => {
    // Check for period of performance dates
    const startDate = award['Start Date'] || award.periodOfPerformanceStartDate;
    const endDate = award['End Date'] || award.periodOfPerformanceEndDate;
    
    // If no period of performance, lower score
    if (!startDate && !endDate) {
      return 50;
    }
    
    // If both dates exist, evaluate the duration
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // Longer periods suggest more oversight and authorization
      // Infrastructure projects typically 1-5 years
      if (durationDays >= 365 && durationDays <= 2190) { // 1-6 years
        return 85;
      }
      
      if (durationDays < 30) {
        // Very short period - might be simplified
        return 55;
      }
      
      // Reasonable duration
      if (durationDays > 0) {
        return 75;
      }
    }
    
    // If only one date exists
    if (startDate || endDate) {
      return 65;
    }
    
    // Default mid-range
    return 60;
  }
};

// All scoring rules
const scoringRules: ScoringRule[] = [
  environmentalReviewRule,
  competitiveBiddingRule,
  modificationAuthRule
];

/**
 * Calculate the procedural compliance score for an award
 * 
 * @param award - Award data from USASpending API
 * @returns ScoreBreakdown with component scores and weighted total
 */
export function calculateScore(award: AwardData): ScoreBreakdown {
  // Evaluate each rule
  const environmental = environmentalReviewRule.evaluate(award);
  const competitiveBidding = competitiveBiddingRule.evaluate(award);
  const modificationAuth = modificationAuthRule.evaluate(award);
  
  // Calculate weighted total
  const total = Math.round(
    (environmental * environmentalReviewRule.weight) +
    (competitiveBidding * competitiveBiddingRule.weight) +
    (modificationAuth * modificationAuthRule.weight)
  );
  
  return {
    environmental,
    competitiveBidding,
    modificationAuth,
    total
  };
}

/**
 * Get a color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-red-100 text-red-800 border-red-300';
}

/**
 * Get a text description of the score
 */
export function getScoreDescription(score: number): string {
  if (score >= 80) return 'High Compliance';
  if (score >= 60) return 'Medium Compliance';
  return 'Low Compliance';
}

/**
 * Get detailed explanation of score components
 */
export function getScoreExplanation(breakdown: ScoreBreakdown): string {
  const environmentalNote = breakdown.environmental >= 80 
    ? 'Infrastructure project with likely NEPA review' 
    : 'Standard review process expected';
  
  const competitiveNote = breakdown.competitiveBidding >= 70
    ? 'Competitive award process'
    : 'Non-competitive or formula-based allocation';
  
  const modificationNote = breakdown.modificationAuth >= 70
    ? 'Proper period of performance defined'
    : 'Limited oversight period';
  
  return `${environmentalNote}. ${competitiveNote}. ${modificationNote}`;
}
