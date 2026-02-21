import { describe, it, expect } from 'vitest'
import { calculateAgencyStats, getScoreBarColor, formatAgencyCurrency, AgencyStats } from './agency-stats'
import { ScoreBreakdown } from './scoring'

describe('agency-stats', () => {
  describe('calculateAgencyStats', () => {
    it('should return empty array for empty input', () => {
      const result = calculateAgencyStats([])
      expect(result).toEqual([])
    })

    it('should aggregate stats for multiple agencies', () => {
      const awards = [
        {
          'Award ID': '1',
          'Awarding Agency': 'Department of Transportation',
          'Award Amount': 1000000,
          score: { total: 80 } as ScoreBreakdown,
        },
        {
          'Award ID': '2',
          'Awarding Agency': 'Department of Transportation',
          'Award Amount': 2000000,
          score: { total: 85 } as ScoreBreakdown,
        },
        {
          'Award ID': '3',
          'Awarding Agency': 'Department of Energy',
          'Award Amount': 500000,
          score: { total: 75 } as ScoreBreakdown,
        },
      ]

      const result = calculateAgencyStats(awards)

      expect(result).toHaveLength(2)
      
      const dot = result.find(a => a.agencyName === 'Department of Transportation')
      expect(dot).toBeDefined()
      expect(dot!.projectCount).toBe(2)
      expect(dot!.totalSpending).toBe(3000000)
      
      const doe = result.find(a => a.agencyName === 'Department of Energy')
      expect(doe).toBeDefined()
      expect(doe!.projectCount).toBe(1)
      expect(doe!.totalSpending).toBe(500000)
    })

    it('should sort by total spending descending', () => {
      const awards = [
        {
          'Award ID': '1',
          'Awarding Agency': 'Small Agency',
          'Award Amount': 100000,
          score: { total: 70 } as ScoreBreakdown,
        },
        {
          'Award ID': '2',
          'Awarding Agency': 'Large Agency',
          'Award Amount': 10000000,
          score: { total: 80 } as ScoreBreakdown,
        },
        {
          'Award ID': '3',
          'Awarding Agency': 'Medium Agency',
          'Award Amount': 1000000,
          score: { total: 75 } as ScoreBreakdown,
        },
      ]

      const result = calculateAgencyStats(awards)

      expect(result[0].agencyName).toBe('Large Agency')
      expect(result[1].agencyName).toBe('Medium Agency')
      expect(result[2].agencyName).toBe('Small Agency')
    })

    it('should calculate score distribution correctly', () => {
      const awards = [
        {
          'Award ID': '1',
          'Awarding Agency': 'Test Agency',
          'Award Amount': 100000,
          score: { total: 85 } as ScoreBreakdown, // green
        },
        {
          'Award ID': '2',
          'Awarding Agency': 'Test Agency',
          'Award Amount': 100000,
          score: { total: 70 } as ScoreBreakdown, // yellow
        },
        {
          'Award ID': '3',
          'Awarding Agency': 'Test Agency',
          'Award Amount': 100000,
          score: { total: 50 } as ScoreBreakdown, // red
        },
      ]

      const result = calculateAgencyStats(awards)

      expect(result).toHaveLength(1)
      const agency = result[0]
      expect(agency.scoreDistribution.green).toBe(1)
      expect(agency.scoreDistribution.yellow).toBe(1)
      expect(agency.scoreDistribution.red).toBe(1)
    })

    it('should handle Unknown agency for missing data', () => {
      const awards = [
        {
          'Award ID': '1',
          // No Awarding Agency
          'Award Amount': 100000,
          score: { total: 75 } as ScoreBreakdown,
        },
      ]

      const result = calculateAgencyStats(awards)

      expect(result).toHaveLength(1)
      expect(result[0].agencyName).toBe('Unknown')
      expect(result[0].projectCount).toBe(1)
    })

    it('should calculate average score correctly', () => {
      const awards = [
        {
          'Award ID': '1',
          'Awarding Agency': 'Test Agency',
          'Award Amount': 100000,
          score: { total: 80 } as ScoreBreakdown,
        },
        {
          'Award ID': '2',
          'Awarding Agency': 'Test Agency',
          'Award Amount': 100000,
          score: { total: 60 } as ScoreBreakdown,
        },
      ]

      const result = calculateAgencyStats(awards)

      expect(result[0].avgScore).toBe(70) // (80 + 60) / 2
    })
  })

  describe('getScoreBarColor', () => {
    it('should return green for high scores (>=80)', () => {
      expect(getScoreBarColor(80)).toBe('#22c55e')
      expect(getScoreBarColor(100)).toBe('#22c55e')
    })

    it('should return yellow for medium scores (>=60, <80)', () => {
      expect(getScoreBarColor(60)).toBe('#eab308')
      expect(getScoreBarColor(79)).toBe('#eab308')
    })

    it('should return red for low scores (<60)', () => {
      expect(getScoreBarColor(59)).toBe('#ef4444')
      expect(getScoreBarColor(0)).toBe('#ef4444')
    })
  })

  describe('formatAgencyCurrency', () => {
    it('should format billions', () => {
      expect(formatAgencyCurrency(1000000000)).toBe('$1.0B')
      expect(formatAgencyCurrency(2500000000)).toBe('$2.5B')
    })

    it('should format millions', () => {
      expect(formatAgencyCurrency(1000000)).toBe('$1.0M')
      expect(formatAgencyCurrency(7500000)).toBe('$7.5M')
    })

    it('should format thousands', () => {
      expect(formatAgencyCurrency(1000)).toBe('$1K')
      expect(formatAgencyCurrency(50000)).toBe('$50K')
    })

    it('should handle small amounts', () => {
      expect(formatAgencyCurrency(500)).toBe('$1K')
    })
  })
})
