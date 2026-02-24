/**
 * Client-side export functionality
 * 
 * Provides browser-based CSV/Excel export without requiring server-side API calls.
 */

import { generateCSV, generateExcel } from './export';

/**
 * Download CSV file directly in browser
 */
export async function downloadCSV(projects: any[], filename: string) {
  const csv = generateCSV(projects);
  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

/**
 * Download Excel file directly in browser
 */
export async function downloadExcel(projects: any[], filename: string) {
  const excel = await generateExcel(projects);
  // Convert Buffer to Blob for browser download
  const excelBlob = new Blob([excel.buffer as ArrayBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  downloadFile(excelBlob, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get suggested filename based on current date and filters
 */
export function getExportFilename(prefix: string = 'projects') {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}`;
}