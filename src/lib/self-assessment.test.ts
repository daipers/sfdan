import { describe, it, expect } from 'vitest'
import { calculateSelfAssessmentScore, getBenchmarks, compareToBenchmark, SelfAssessmentInput } from './self-assessment'

describe('self-assessment', () => {
  describe('calculateSelfAssessmentScore', () => {
    it('should return high score for competitive award', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        environmentalReviewDate: '2023-06-01',
        totalFundingAmount: 5000000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.total).toBeGreaterThan(70)
      expect(result.rating).toBe('High Compliance')
      expect(result.environmental).toBe(90)
      expect(result.competitiveBidding).toBe(85)
    })

    it('should return lower score for sole source award', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        totalFundingAmount: 5000000,
        competitionType: 'sole_source',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.competitiveBidding).toBe(40)
      expect(result.total).toBeLessThan(70)
      expect(result.rating).toBe('Medium Compliance')
    })

    it('should generate score breakdown', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        totalFundingAmount: 5000000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.breakdown).toBeTruthy()
      expect(typeof result.breakdown).toBe('string')
    })

    it('should generate recommendations for low scores', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        // No environmental review date
        totalFundingAmount: 5000000,
        competitionType: 'sole_source',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.recommendations).toBeTruthy()
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should handle missing end date', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-energy',
        awardType: 'grant',
        startDate: '2024-01-01',
        // No end date
        totalFundingAmount: 500000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.modificationAuth).toBe(65)
    })

    it('should handle follow-on awards', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        totalFundingAmount: 5000000,
        competitionType: 'follow-on',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.competitiveBidding).toBe(60)
    })

    it('should give higher environmental score for NEPA agencies with review date', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'environmental-protection-agency',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        environmentalReviewDate: '2023-06-01',
        totalFundingAmount: 5000000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      expect(result.environmental).toBe(90)
    })

    it('should give lower environmental score for large NEPA agency without review date', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        // No environmental review date
        totalFundingAmount: 5000000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      // Large award from NEPA agency but no review date
      expect(result.environmental).toBe(55)
    })

    it('should calculate correct weighted total', () => {
      const input: SelfAssessmentInput = {
        projectName: 'Test Project',
        agency: 'department-of-transportation',
        awardType: 'grant',
        startDate: '2024-01-01',
        endDate: '2027-12-31',
        environmentalReviewDate: '2023-06-01',
        totalFundingAmount: 5000000,
        competitionType: 'competitive',
      }

      const result = calculateSelfAssessmentScore(input)

      // Environmental: 90 * 0.40 = 36
      // Competitive: 85 * 0.35 = 29.75
      // Modification: 85 * 0.25 = 21.25
      // Total: 87
      expect(result.total).toBe(87)
    })
  })

  describe('getBenchmarks', () => {
    it('should return benchmark data', () => {
      const benchmarks = getBenchmarks()

      expect(benchmarks).toHaveProperty('averageScore')
      expect(benchmarks).toHaveProperty('highComplianceThreshold')
      expect(benchmarks).toHaveProperty('mediumComplianceThreshold')
      expect(benchmarks.averageScore).toBe(68)
    })
  })

  describe('compareToBenchmark', () => {
    it('should return above comparison for high scores', () => {
      const result = compareToBenchmark(85)

      expect(result.comparison).toBe('above')
      expect(result.percentile).toBeGreaterThan(50)
      expect(result.difference).toBe(17) // 85 - 68
    })

    it('should return average comparison for mid scores', () => {
      const result = compareToBenchmark(70)

      expect(result.comparison).toBe('average')
      expect(result.difference).toBe(2) // 70 - 68
    })

    it('should return below comparison for low scores', () => {
      const result = compareToBenchmark(50)

      expect(result.comparison).toBe('below')
      expect(result.percentile).toBeLessThan(50)
      expect(result.difference).toBe(18) // 68 - 50
    })

    it('should handle edge case at threshold', () => {
      const result = compareToBenchmark(73) // 68 + 5

      expect(result.comparison).toBe('above')
      expect(result.percentile).toBe(75)
    })
  })
})
