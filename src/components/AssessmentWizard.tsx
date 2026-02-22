// src/components/AssessmentWizard.tsx
'use client'

import { useState } from 'react'
import {
  SelfAssessmentInput,
  calculateSelfAssessmentScore,
  agencyOptions,
  getBenchmarks,
  compareToBenchmark
} from '@/lib/self-assessment'
import { LeadCaptureCard } from '@/components/LeadCaptureCard'

type Step = 'basic' | 'timeline' | 'competition' | 'funding' | 'results'

interface FormData extends SelfAssessmentInput {
  // Extended with UI state
}

const initialFormData: FormData = {
  projectName: '',
  agency: '',
  awardType: 'grant',
  startDate: '',
  endDate: '',
  environmentalReviewDate: '',
  bidSolicitationDate: '',
  lastModificationDate: '',
  totalFundingAmount: 0,
  competitionType: 'competitive',
}

const steps: { key: Step; title: string; description: string }[] = [
  { key: 'basic', title: 'Basic Info', description: 'Project name and agency' },
  { key: 'timeline', title: 'Timeline', description: 'Project dates' },
  { key: 'competition', title: 'Competition', description: 'Procurement type' },
  { key: 'funding', title: 'Funding', description: 'Amount and modifications' },
]

export function AssessmentWizard({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [scoreResult, setScoreResult] = useState<ReturnType<typeof calculateSelfAssessmentScore> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 'basic':
        if (!formData.projectName.trim()) {
          newErrors.projectName = 'Project name is required'
        }
        if (!formData.agency) {
          newErrors.agency = 'Please select an agency'
        }
        if (!formData.awardType) {
          newErrors.awardType = 'Please select an award type'
        }
        break

      case 'timeline':
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required'
        }
        break

      case 'competition':
        if (!formData.competitionType) {
          newErrors.competitionType = 'Please select competition type'
        }
        break

      case 'funding':
        if (!formData.totalFundingAmount || formData.totalFundingAmount <= 0) {
          newErrors.totalFundingAmount = 'Funding amount is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return
    }

    const currentIndex = steps.findIndex(s => s.key === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key)
    } else {
      // Calculate score on final step
      calculateAndShowResults()
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key)
    }
  }

  const calculateAndShowResults = () => {
    const result = calculateSelfAssessmentScore(formData)
    setScoreResult(result)
    setCurrentStep('results')
    if (onComplete) {
      onComplete()
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setScoreResult(null)
    setCurrentStep('basic')
    setErrors({})
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
          >
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStepIndex 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-1 mx-2
                  ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {steps[currentStepIndex]?.title || 'Results'}
        </h2>
        <p className="text-sm text-gray-500">
          {steps[currentStepIndex]?.description}
        </p>
      </div>
    </div>
  )

  const renderBasicInfoStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          value={formData.projectName}
          onChange={(e) => updateField('projectName', e.target.value)}
          placeholder="e.g., Highway 101 Improvement Project"
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.projectName ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.projectName && (
          <p className="text-sm text-red-500 mt-1">{errors.projectName}</p>
        )}
      </div>

      <div>
        <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
          Awarding Agency <span className="text-red-500">*</span>
        </label>
        <select
          id="agency"
          value={formData.agency}
          onChange={(e) => updateField('agency', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.agency ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <option value="">Select an agency</option>
          {agencyOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.agency && (
          <p className="text-sm text-red-500 mt-1">{errors.agency}</p>
        )}
      </div>

      <div>
        <label htmlFor="awardType" className="block text-sm font-medium text-gray-700 mb-1">
          Award Type <span className="text-red-500">*</span>
        </label>
        <select
          id="awardType"
          value={formData.awardType}
          onChange={(e) => updateField('awardType', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.awardType ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <option value="grant">Grant</option>
          <option value="contract">Contract</option>
          <option value="loan">Loan</option>
          <option value="direct_payment">Direct Payment</option>
        </select>
        {errors.awardType && (
          <p className="text-sm text-red-500 mt-1">{errors.awardType}</p>
        )}
      </div>
    </div>
  )

  const renderTimelineStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          Project Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) => updateField('startDate', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.startDate ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">When the award was or will be activated</p>
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
          Project End Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          id="endDate"
          value={formData.endDate || ''}
          onChange={(e) => updateField('endDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Expected completion date</p>
      </div>

      <div>
        <label htmlFor="environmentalReviewDate" className="block text-sm font-medium text-gray-700 mb-1">
          Environmental Review Completion Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          id="environmentalReviewDate"
          value={formData.environmentalReviewDate || ''}
          onChange={(e) => updateField('environmentalReviewDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">NEPA review date, if applicable</p>
      </div>
    </div>
  )

  const renderCompetitionStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="competitionType" className="block text-sm font-medium text-gray-700 mb-1">
          Competition Type <span className="text-red-500">*</span>
        </label>
        <select
          id="competitionType"
          value={formData.competitionType}
          onChange={(e) => updateField('competitionType', e.target.value)}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.competitionType ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <option value="competitive">Competitive - Open solicitation</option>
          <option value="sole_source">Sole Source - No competition</option>
          <option value="follow-on">Follow-on - Continuation of previous award</option>
        </select>
        {errors.competitionType && (
          <p className="text-sm text-red-500 mt-1">{errors.competitionType}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          How the award was allocated to your organization
        </p>
      </div>

      <div>
        <label htmlFor="bidSolicitationDate" className="block text-sm font-medium text-gray-700 mb-1">
          Bid/Solicitation Publication Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          id="bidSolicitationDate"
          value={formData.bidSolicitationDate || ''}
          onChange={(e) => updateField('bidSolicitationDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">When the RFP or solicitation was published</p>
      </div>
    </div>
  )

  const renderFundingStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="totalFundingAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Total Funding Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            id="totalFundingAmount"
            value={formData.totalFundingAmount || ''}
            onChange={(e) => updateField('totalFundingAmount', parseFloat(e.target.value) || 0)}
            placeholder="1000000"
            min="0"
            step="1"
            className={`
              w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.totalFundingAmount ? 'border-red-500' : 'border-gray-300'}
            `}
          />
        </div>
        {errors.totalFundingAmount && (
          <p className="text-sm text-red-500 mt-1">{errors.totalFundingAmount}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Total federal funds awarded</p>
      </div>

      <div>
        <label htmlFor="lastModificationDate" className="block text-sm font-medium text-gray-700 mb-1">
          Last Modification Date <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="date"
          id="lastModificationDate"
          value={formData.lastModificationDate || ''}
          onChange={(e) => updateField('lastModificationDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Most recent award modification or extension</p>
      </div>
    </div>
  )

  const renderResultsStep = () => {
    if (!scoreResult) return null

    const benchmarks = getBenchmarks()
    const comparison = compareToBenchmark(scoreResult.total)

    const getScoreColor = (score: number) => {
      if (score >= 75) return 'bg-green-100 text-green-800 border-green-300'
      if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      return 'bg-red-100 text-red-800 border-red-300'
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    return (
      <div className="space-y-6">
        {/* Project Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{formData.projectName}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="text-gray-500">Agency:</span>{' '}
              {agencyOptions.find(a => a.value === formData.agency)?.label || formData.agency}
            </div>
            <div>
              <span className="text-gray-500">Award Type:</span> {formData.awardType}
            </div>
            <div>
              <span className="text-gray-500">Amount:</span>{' '}
              {formatCurrency(formData.totalFundingAmount)}
            </div>
            <div>
              <span className="text-gray-500">Competition:</span> {formData.competitionType}
            </div>
          </div>
        </div>

        {/* Main Score */}
        <div className="text-center">
          <div className={`
            inline-flex items-center justify-center w-32 h-32 rounded-full 
            text-4xl font-bold border-4
            ${getScoreColor(scoreResult.total)}
          `}>
            {scoreResult.total}
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">{scoreResult.rating}</p>
        </div>

        {/* Benchmark Comparison */}
        <div className={`
          p-4 rounded-lg border-2 text-center
          ${comparison.comparison === 'above' ? 'bg-green-50 border-green-200' :
            comparison.comparison === 'below' ? 'bg-red-50 border-red-200' :
            'bg-gray-50 border-gray-200'}
        `}>
          <p className="text-sm">
            {comparison.comparison === 'above' ? (
              <>Your score is <strong>{comparison.difference} points above</strong> the public benchmark</>
            ) : comparison.comparison === 'below' ? (
              <>Your score is <strong>{comparison.difference} points below</strong> the public benchmark</>
            ) : (
              <>Your score is <strong>about average</strong> compared to public data</>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Public benchmark: {benchmarks.averageScore} (based on IIJA award analysis)
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Score Breakdown</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border ${getScoreColor(scoreResult.environmental)}`}>
              <div className="text-xs font-medium mb-1">Environmental</div>
              <div className="text-2xl font-bold">{scoreResult.environmental}</div>
              <div className="text-xs">40% weight</div>
            </div>
            <div className={`p-3 rounded-lg border ${getScoreColor(scoreResult.competitiveBidding)}`}>
              <div className="text-xs font-medium mb-1">Competition</div>
              <div className="text-2xl font-bold">{scoreResult.competitiveBidding}</div>
              <div className="text-xs">35% weight</div>
            </div>
            <div className={`p-3 rounded-lg border ${getScoreColor(scoreResult.modificationAuth)}`}>
              <div className="text-xs font-medium mb-1">Period</div>
              <div className="text-2xl font-bold">{scoreResult.modificationAuth}</div>
              <div className="text-xs">25% weight</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {scoreResult.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {scoreResult.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        <LeadCaptureCard
          mode="form"
          title="Get your detailed compliance report"
          description="Receive a full report with score drivers, risks, and suggested next steps tailored to your inputs."
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Start Over
          </button>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          Your data is processed locally and never stored or shared. 
          This assessment is for informational purposes only.
        </p>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return renderBasicInfoStep()
      case 'timeline':
        return renderTimelineStep()
      case 'competition':
        return renderCompetitionStep()
      case 'funding':
        return renderFundingStep()
      case 'results':
        return renderResultsStep()
      default:
        return null
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {renderProgressBar()}
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderCurrentStep()}
        
        {currentStep !== 'results' && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {currentStepIndex === steps.length - 1 ? 'Calculate Score' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
