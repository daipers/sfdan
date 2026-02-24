/**
 * Static data loading utilities
 * 
 * Provides client-side data loading and processing for GitHub Pages static hosting.
 */

import { calculateAgencyStats } from './agency-stats';

/**
 * Pre-compute agency stats from projects data
 */
export function getStaticAgencyStats(projects: any[]) {
  return calculateAgencyStats(projects);
}

/**
 * Simulate API delay for realistic loading experience
 */
export async function loadAgencyStatsWithDelay(projects: any[], delay = 500) {
  await new Promise(resolve => setTimeout(resolve, delay));
  return getStaticAgencyStats(projects);
}

/**
 * Load projects data with client-side processing
 */
export async function loadProjectsData(projects: any[]) {
  // Add any client-side processing here
  return projects.map(project => ({
    ...project,
    // Ensure score is available for client-side calculations
    score: project.score || 0,
    displayScore: project.score ? `${project.score}/100` : 'N/A'
  }));
}

/**
 * Get static content for pages that don't have dynamic data
 */
export function getStaticContent(type: 'faq' | 'methodology' | 'data-sources') {
  const content = {
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Common questions about the Procedural Integrity Score Dashboard'
    },
    methodology: {
      title: 'Methodology',
      description: 'How we calculate procedural integrity scores'
    },
    'data-sources': {
      title: 'Data Sources',
      description: 'Information about our data sources and update frequency'
    }
  };
  
  return content[type] || content.faq;
}