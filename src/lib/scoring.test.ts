import { describe, it, expect } from 'vitest'
import { calculateScore, getScoreColorClass, getScoreDescription, getScoreExplanation, ScoreBreakdown, AwardData } from './scoring'

describe('scoring', () => {
  describe('calculateScore', () => {
    it('should return high score for full infrastructure award data', () => {
      const award: AwardData = {
        'Award ID': 'TEST-001',
        'Description': 'Highway construction project for bridge repair',
        'Recipient Name': 'City of Example',
        'Awarding Agency': 'Department of Transportation',
        'Award Amount': 5000000,
        'Start Date': '2024-01-01',
        'End Date': '2027-12-31',
        awardTypeCode: 'B', // Project Grant - competitive
      }

      const result = calculateScore(award)

      expect(result).toHaveProperty('environmental')
      expect(result).toHaveProperty('competitiveBidding')
      expect(result).toHaveProperty('modificationAuth')
      expect(result).toHaveProperty('total')
      expect(result.total).toBeGreaterThan(70)
    })

    it('should return lower score when missing critical dates', () => {
      const award: AwardData = {
        'Award ID': 'TEST-002',
        'Description': 'Highway construction',
        'Recipient Name': 'County of Example',
        'Award Amount': 1000000,
        // Missing Start Date and End Date
      }

      const result = calculateScore(award)

      // Environmental score should still be high due to highway keyword
      expect(result.environmental).toBe(85)
      // Modification auth should be lower due to missing dates
      expect(result.modificationAuth).toBe(50)
      expect(result.total).toBeLessThan(70)
    })

    it('should return lower score for non-infrastructure awards', () => {
      const award: AwardData = {
        'Award ID': 'TEST-003',
        'Description': 'Administrative support services',
        'Recipient Name': 'Example Corp',
        'Award Amount': 50000,
        'Start Date': '2024-01-01',
        'End Date': '2024-12-31',
        awardTypeCode: 'A', // Formula Grant
      }

      const result = calculateScore(award)

      // Environmental should be lower (60) for non-infrastructure
      expect(result.environmental).toBe(60)
      // Competitive should be 50 for formula grant
      expect(result.competitiveBidding).toBe(50)
    })

    it('should handle edge cases with no description', () => {
      const award: AwardData = {
        'Award ID': 'TEST-004',
        // No description
      }

      const result = calculateScore(award)

      expect(result.total).toBeGreaterThan(0)
      expect(result.total).toBeLessThanOrEqual(100)
    })

    it('should handle award type D (Loan)', () => {
      const award: AwardData = {
        'Award ID': 'TEST-005',
        'Description': 'Infrastructure loan',
        awardTypeCode: 'D',
        'Start Date': '2024-01-01',
        'End Date': '2029-12-31',
      }

      const result = calculateScore(award)

      expect(result.competitiveBidding).toBe(65)
    })

    it('should handle cooperative agreement (type C)', () => {
      const award: AwardData = {
        'Award ID': 'TEST-006',
        'Description': 'Research cooperation',
        awardTypeCode: 'C',
        'Start Date': '2024-01-01',
        'End Date': '2026-12-31',
      }

      const result = calculateScore(award)

      expect(result.competitiveBidding).toBe(70)
    })

    it('should calculate correct weighted total', () => {
      const award: AwardData = {
        'Award ID': 'TEST-007',
        'Description': 'Bridge construction',
        'Start Date': '2024-01-01',
        'End Date': '2028-12-31',
        awardTypeCode: 'B',
      }

      const result = calculateScore(award)

      // Environmental: 85 * 0.35 = 29.75
      // Competitive: 85 * 0.35 = 29.75
      // Modification: 85 * 0.30 = 25.5
      // Total: 85
      expect(result.total).toBe(85)
    })
  })

  describe('getScoreColorClass', () => {
    it('should return green class for high scores (>=80)', () => {
      expect(getScoreColorClass(80)).toContain('green')
      expect(getScoreColorClass(100)).toContain('green')
    })

    it('should return yellow class for medium scores (>=60, <80)', () => {
      expect(getScoreColorClass(60)).toContain('yellow')
      expect(getScoreColorClass(70)).toContain('yellow')
      expect(getScoreColorClass(79)).toContain('yellow')
    })

    it('should return red class for low scores (<60)', () => {
      expect(getScoreColorClass(59)).toContain('red')
      expect(getScoreColorClass(0)).toContain('red')
    })
  })

  describe('getScoreDescription', () => {
    it('should return "High Compliance" for scores >= 80', () => {
      expect(getScoreDescription(80)).toBe('High Compliance')
      expect(getScoreDescription(100)).toBe('High Compliance')
    })

    it('should return "Medium Compliance" for scores >= 60 and < 80', () => {
      expect(getScoreDescription(60)).toBe('Medium Compliance')
      expect(getScoreDescription(79)).toBe('Medium Compliance')
    })

    it('should return "Low Compliance" for scores < 60', () => {
      expect(getScoreDescription(59)).toBe('Low Compliance')
      expect(getScoreDescription(0)).toBe('Low Compliance')
    })
  })

  describe('getScoreExplanation', () => {
    it('should generate explanation for high scores', () => {
      const breakdown: ScoreBreakdown = {
        environmental: 85,
        competitiveBidding: 85,
        modificationAuth: 85,
        total: 85,
      }

      const explanation = getScoreExplanation(breakdown)

      expect(explanation).toContain('Infrastructure project with likely NEPA review')
      expect(explanation).toContain('Competitive award process')
      expect(explanation).toContain('Proper period of performance defined')
    })

    it('should generate explanation for low scores', () => {
      const breakdown: ScoreBreakdown = {
        environmental: 50,
        competitiveBidding: 40,
        modificationAuth: 45,
        total: 45,
      }

      const explanation = getScoreExplanation(breakdown)

      expect(explanation).toContain('Standard review process expected')
      expect(explanation).toContain('Non-competitive or formula-based allocation')
      expect(explanation).toContain('Limited oversight period')
    })
  })
})
