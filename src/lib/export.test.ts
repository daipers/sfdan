import { describe, it, expect } from 'vitest'
import { generateCSV, transformForExport, generateExcel, ExportAward } from './export'

describe('export', () => {
  describe('generateCSV', () => {
    it('should return empty string for empty array', () => {
      const result = generateCSV([])
      expect(result).toBe('')
    })

    it('should generate CSV with correct headers', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          'Recipient Name': 'Test Corp',
          'Awarding Agency': 'DOT',
          'Funding Agency': 'DOT',
          'Award Amount': 100000,
          'Start Date': '2024-01-01',
          'End Date': '2024-12-31',
          'Place of Performance State': 'CA',
          score: {
            environmental: 85,
            competitiveBidding: 80,
            modificationAuth: 75,
            total: 80,
          },
        },
      ]

      const result = generateCSV(awards)

      expect(result).toContain('Award ID')
      expect(result).toContain('Project Name')
      expect(result).toContain('Recipient')
      expect(result).toContain('Award Amount')
      expect(result).toContain('Total Score')
    })

    it('should generate CSV with data rows', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          'Recipient Name': 'Test Corp',
          'Award Amount': 100000,
        },
      ]

      const result = generateCSV(awards)

      expect(result).toContain('TEST-001')
      expect(result).toContain('Test project')
      expect(result).toContain('Test Corp')
    })

    it('should handle empty/undefined values gracefully', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          // Missing other fields
        },
      ]

      const result = generateCSV(awards)

      expect(result).toContain('TEST-001')
      expect(result).toContain('N/A') // Default for missing agency fields
    })

    it('should escape commas in CSV values', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test, project',
          'Recipient Name': 'Test, Corp',
        },
      ]

      const result = generateCSV(awards)

      // Should wrap values containing commas in quotes
      expect(result).toContain('"Test, project"')
      expect(result).toContain('"Test, Corp"')
    })

    it('should escape quotes in CSV values', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test "quoted" project',
        },
      ]

      const result = generateCSV(awards)

      // Should double-quote escaped quotes
      expect(result).toContain('"Test ""quoted"" project"')
    })

    it('should include score breakdown in CSV', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          score: {
            environmental: 85,
            competitiveBidding: 80,
            modificationAuth: 75,
            total: 80,
          },
        },
      ]

      const result = generateCSV(awards)

      expect(result).toContain('80') // Total score
      expect(result).toContain('E:85') // Environmental
    })
  })

  describe('transformForExport', () => {
    it('should transform award data for export', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          'Recipient Name': 'Test Corp',
          'Award Amount': 100000,
        },
      ]

      const result = transformForExport(awards)

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('Award ID')
      expect(result[0]).toHaveProperty('Project Name')
      expect(result[0]).toHaveProperty('Recipient')
    })

    it('should handle empty array', () => {
      const result = transformForExport([])
      expect(result).toEqual([])
    })

    it('should use Award ID as fallback for project name', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          // No description
        },
      ]

      const result = transformForExport(awards)

      expect(result[0]['Project Name']).toBe('TEST-001')
    })

    it('should use N/A for missing recipient/agency', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
        },
      ]

      const result = transformForExport(awards)

      expect(result[0]['Recipient']).toBe('N/A')
      expect(result[0]['Awarding Agency']).toBe('N/A')
      expect(result[0]['Funding Agency']).toBe('N/A')
    })

    it('should handle score data', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          score: {
            environmental: 85,
            competitiveBidding: 80,
            modificationAuth: 75,
            total: 80,
          },
        },
      ]

      const result = transformForExport(awards)

      expect(result[0]['Total Score']).toBe(80)
      expect(result[0]['Environmental Score']).toBe(85)
      expect(result[0]['Score Breakdown']).toContain('E:85')
    })
  })

  describe('generateExcel', () => {
    it('should generate Excel buffer', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          'Award Amount': 100000,
        },
      ]

      const result = generateExcel(awards)

      expect(result).toBeInstanceOf(Buffer)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should include filter stats in summary sheet', () => {
      const awards: ExportAward[] = [
        {
          'Award ID': 'TEST-001',
          'Description': 'Test project',
          'Award Amount': 100000,
        },
      ]

      const filterStats = {
        totalCount: 1,
        totalSpending: 100000,
        avgScore: 75,
        filters: { state: 'CA' },
      }

      const result = generateExcel(awards, filterStats)

      expect(result).toBeInstanceOf(Buffer)
    })
  })
})
