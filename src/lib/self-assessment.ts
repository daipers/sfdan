/**
 * Self-Assessment Scoring Logic
 * 
 * Allows users to input their own project data and receive a private
 * compliance score based on the same methodology used for public data.
 * 
 * Based on: 2 CFR 200, Build America Buy America, Davis-Bacon Act
 * 
 * Scoring Components:
 * - Environmental Review (40%): NEPA compliance indicators
 * - Competitive Bidding (35%): Competition in award allocation
 * - Modification Authorization (25%): Oversight and period of performance
 */

export interface SelfAssessmentInput {
  projectName: string;
  agency: string;
  awardType: 'grant' | 'contract' | 'loan' | 'direct_payment';
  startDate: string;
  endDate?: string;
  environmentalReviewDate?: string;
  bidSolicitationDate?: string;
  lastModificationDate?: string;
  totalFundingAmount: number;
  competitionType: 'competitive' | 'sole_source' | 'follow-on';
}

export interface SelfAssessmentScore {
  environmental: number;
  competitiveBidding: number;
  modificationAuth: number;
  total: number;
  rating: 'High Compliance' | 'Medium Compliance' | 'Low Compliance';
  breakdown: string;
  recommendations: string[];
}

// Common federal agencies for dropdown
export const agencyOptions = [
  { value: 'department-of-transportation', label: 'Department of Transportation (DOT)' },
  { value: 'department-of-energy', label: 'Department of Energy (DOE)' },
  { value: 'department-of-housing-urban-development', label: 'Department of Housing and Urban Development (HUD)' },
  { value: 'department-of-commerce', label: 'Department of Commerce (DOC)' },
  { value: 'department-of-agriculture', label: 'Department of Agriculture (USDA)' },
  { value: 'environmental-protection-agency', label: 'Environmental Protection Agency (EPA)' },
  { value: 'department-of-interior', label: 'Department of Interior (DOI)' },
  { value: 'federal-highway-administration', label: 'Federal Highway Administration (FHWA)' },
  { value: 'federal-transit-administration', label: 'Federal Transit Administration (FTA)' },
  { value: 'other', label: 'Other Federal Agency' },
];

/**
 * Calculate environmental review score (40% weight)
 */
function calculateEnvironmentalScore(input: SelfAssessmentInput): number {
  // Infrastructure agencies typically require NEPA review
  const nepaAgencies = [
    'department-of-transportation',
    'department-of-energy',
    'department-of-housing-urban-development',
    'department-of-commerce',
    'department-of-agriculture',
    'environmental-protection-agency',
    'department-of-interior',
    'federal-highway-administration',
    'federal-transit-administration',
  ];
  
  const isNepaAgency = nepaAgencies.includes(input.agency);
  
  // If environmental review date is provided, higher score
  if (input.environmentalReviewDate) {
    return isNepaAgency ? 90 : 80;
  }
  
  // If no environmental review date, check if it's likely needed
  if (isNepaAgency && input.totalFundingAmount >= 100000) {
    // Large award from NEPA agency but no review date - concerning
    return 55;
  }
  
  // Default mid-range
  return 65;
}

/**
 * Calculate competitive bidding score (35% weight)
 */
function calculateCompetitiveScore(input: SelfAssessmentInput): number {
  // Check competition type
  switch (input.competitionType) {
    case 'competitive':
      return 85;
    case 'sole_source':
      return 40;
    case 'follow-on':
      // Follow-on awards can be legitimate but indicate reduced competition
      return 60;
    default:
      return 50;
  }
}

/**
 * Calculate modification authorization score (25% weight)
 */
function calculateModificationScore(input: SelfAssessmentInput): number {
  // Need both start and end dates for proper evaluation
  if (!input.startDate) {
    return 45;
  }
  
  // If end date is provided, evaluate duration
  if (input.endDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const durationDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Infrastructure projects typically 1-5 years
    if (durationDays >= 365 && durationDays <= 2190) { // 1-6 years
      return 85;
    }
    
    if (durationDays < 30) {
      return 55;
    }
    
    if (durationDays > 0) {
      return 75;
    }
  }
  
  // If only start date, assume reasonable default
  if (input.startDate) {
    return 65;
  }
  
  return 50;
}

/**
 * Calculate the self-assessment score
 * 
 * @param input - User-submitted project data
 * @returns Detailed score breakdown with recommendations
 */
export function calculateSelfAssessmentScore(input: SelfAssessmentInput): SelfAssessmentScore {
  // Calculate component scores
  const environmental = calculateEnvironmentalScore(input);
  const competitiveBidding = calculateCompetitiveScore(input);
  const modificationAuth = calculateModificationScore(input);
  
  // Apply weighted formula (40% env, 35% competitive, 25% modification)
  const total = Math.round(
    (environmental * 0.40) +
    (competitiveBidding * 0.35) +
    (modificationAuth * 0.25)
  );
  
  // Determine rating
  let rating: 'High Compliance' | 'Medium Compliance' | 'Low Compliance';
  if (total >= 75) {
    rating = 'High Compliance';
  } else if (total >= 50) {
    rating = 'Medium Compliance';
  } else {
    rating = 'Low Compliance';
  }
  
  // Generate breakdown text
  const breakdown = generateBreakdown(input, environmental, competitiveBidding, modificationAuth);
  
  // Generate recommendations
  const recommendations = generateRecommendations(input, environmental, competitiveBidding, modificationAuth);
  
  return {
    environmental,
    competitiveBidding,
    modificationAuth,
    total,
    rating,
    breakdown,
    recommendations,
  };
}

/**
 * Generate a human-readable breakdown
 */
function generateBreakdown(
  input: SelfAssessmentInput,
  env: number,
  comp: number,
  mod: number
): string {
  const envNote = env >= 80 
    ? 'Project from agency with likely NEPA requirements' 
    : 'Environmental review status unclear';
  
  const compNote = input.competitionType === 'competitive'
    ? 'Competitive procurement process'
    : input.competitionType === 'sole_source'
    ? 'Non-competitive (sole source) award'
    : 'Follow-on or non-competitive award';
  
  const modNote = input.endDate
    ? 'Defined period of performance'
    : 'No end date provided';
  
  return `${envNote}. ${compNote}. ${modNote}.`;
}

/**
 * Generate recommendations based on score components
 */
function generateRecommendations(
  input: SelfAssessmentInput,
  env: number,
  comp: number,
  mod: number
): string[] {
  const recommendations: string[] = [];
  
  // Environmental recommendations
  if (env < 70 && !input.environmentalReviewDate) {
    if (input.totalFundingAmount >= 100000 && 
        ['department-of-transportation', 'environmental-protection-agency'].includes(input.agency)) {
      recommendations.push(
        'Consider documenting your NEPA environmental review status - required for major federal awards'
      );
    }
  }
  
  // Competitive recommendations
  if (comp < 60) {
    if (input.competitionType === 'sole_source') {
      recommendations.push(
        'Document the justification for sole-source procurement per 2 CFR 200.320'
      );
    } else if (input.competitionType === 'follow-on') {
      recommendations.push(
        'Ensure follow-on awards have proper justification and are not avoiding competition'
      );
    }
  }
  
  // Modification/period recommendations
  if (!input.endDate) {
    recommendations.push(
      'Define a clear period of performance end date for proper grant management'
    );
  }
  
  if (mod < 60 && input.startDate && input.endDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const durationDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (durationDays < 365) {
      recommendations.push(
        'Consider a longer period of performance for infrastructure projects (typically 1-5 years)'
      );
    }
  }
  
  // General recommendation if score is low
  if (env < 60 || comp < 50 || mod < 50) {
    recommendations.push(
      'Review federal requirements at https://www.ecfr.gov (2 CFR 200) for compliance guidance'
    );
  }
  
  // Positive feedback
  if (env >= 80 && comp >= 80 && mod >= 80) {
    recommendations.push(
      'Your project appears to meet key procedural compliance indicators'
    );
  }
  
  return recommendations;
}

/**
 * Get benchmark comparison data
 */
export function getBenchmarks() {
  return {
    averageScore: 68,
    highComplianceThreshold: 75,
    mediumComplianceThreshold: 50,
    description: 'Based on analysis of public IIJA award data',
  };
}

/**
 * Compare user score to benchmarks
 */
export function compareToBenchmark(userScore: number): {
  percentile: number;
  comparison: 'above' | 'below' | 'average';
  difference: number;
} {
  const benchmarks = getBenchmarks();
  const difference = userScore - benchmarks.averageScore;
  
  // Rough percentile estimation
  let percentile: number;
  let comparison: 'above' | 'below' | 'average';
  
  if (difference >= 15) {
    percentile = 90;
    comparison = 'above';
  } else if (difference >= 5) {
    percentile = 75;
    comparison = 'above';
  } else if (difference >= -5) {
    percentile = 50;
    comparison = 'average';
  } else if (difference >= -15) {
    percentile = 25;
    comparison = 'below';
  } else {
    percentile = 10;
    comparison = 'below';
  }
  
  return { percentile, comparison, difference: Math.abs(difference) };
}
