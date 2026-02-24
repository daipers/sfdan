/**
 * Client-side API replacement library
 * 
 * Provides client-side alternatives to server-side API routes for GitHub Pages static hosting.
 * These functions work with static data and don't require server-side processing.
 */

import { calculateAgencyStats } from './agency-stats';
import { generateCSV, generateExcel } from './export';

/**
 * Client-side replacement for /api/agency-stats
 * Calculates agency statistics from provided project data
 */
export async function getAgencyStatsClient(projects: any[]) {
  return calculateAgencyStats(projects);
}

/**
 * Client-side replacement for /api/export
 * Generates and downloads CSV/Excel files directly in the browser
 */
export async function exportDataClient(
  projects: any[],
  format: 'csv' | 'excel',
  filename: string
) {
  if (format === 'csv') {
    const csv = generateCSV(projects);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  } else {
    const excel = await generateExcel(projects);
    // Convert Buffer to Blob for browser download
    const excelBlob = new Blob([excel.buffer as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadFile(excelBlob, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
}

/**
 * Client-side replacement for /api/insights/generate
 * Generates simple insights from project data without server processing
 */
export async function generateInsightsClient(projects: any[]) {
  // Simple insights generation based on project data
  const highScoreProjects = projects.filter(p => p.score >= 80);
  const lowScoreProjects = projects.filter(p => p.score < 60);
  const totalScore = projects.reduce((sum, p) => sum + (p.score || 0), 0);
  const averageScore = projects.length > 0 ? totalScore / projects.length : 0;
  
  return {
    totalProjects: projects.length,
    highScoreCount: highScoreProjects.length,
    lowScoreCount: lowScoreProjects.length,
    averageScore: Math.round(averageScore * 10) / 10,
    insights: [
      `Found ${highScoreProjects.length} projects with excellent compliance scores (≥80)`,
      `Identified ${lowScoreProjects.length} projects needing attention (<60)`,
      `Overall average score: ${Math.round(averageScore)}`
    ]
  };
}

/**
 * Client-side replacement for /api/health
 * Returns static health status for GitHub Pages
 */
export function getHealthStatusClient() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'static-export',
    version: '1.0.0'
  };
}

/**
 * Helper function to download files in the browser
 */
function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Simulate API delay for realistic loading experience
 */
export async function simulateApiDelay(delay = 300) {
  return new Promise(resolve => setTimeout(resolve, delay));
}