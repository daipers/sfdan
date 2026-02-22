// src/components/NewsletterSignupForm.tsx
'use client'

import { FormEvent, useState } from 'react'

interface NewsletterFormData {
  email: string
  organization: string
  role: string
  interests: string[]
}

const roleOptions = [
  { value: '', label: 'Select your role (optional)' },
  { value: 'journalist', label: 'Journalist / Reporter' },
  { value: 'researcher', label: 'Researcher / Analyst' },
  { value: 'government', label: 'Government Official' },
  { value: 'advocate', label: 'Advocacy / Non-profit' },
  { value: 'developer', label: 'Developer / Tech' },
  { value: 'other', label: 'Other' },
]

const interestOptions = [
  { value: 'integrity-scores', label: 'Integrity score outliers' },
  { value: 'spending-concentration', label: 'Spending concentration by agency/state' },
  { value: 'trend-shifts', label: 'Month-over-month trend shifts' },
  { value: 'project-risk', label: 'Project risk and compliance signals' },
  { value: 'policy-updates', label: 'Policy and regulatory changes' },
]

export function NewsletterSignupForm() {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    organization: '',
    role: '',
    interests: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successEmail, setSuccessEmail] = useState<string>('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.email || !validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          organization: formData.organization || undefined,
          role: formData.role || undefined,
          interests: formData.interests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit signup')
      }

      setSuccessEmail(formData.email)
      setSuccess(true)
      setFormData({ email: '', organization: '', role: '', interests: [] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof NewsletterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const toggleInterest = (value: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.interests.includes(value)
      const nextInterests = alreadySelected
        ? prev.interests.filter((interest) => interest !== value)
        : [...prev.interests, value]
      return { ...prev, interests: nextInterests }
    })
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 text-green-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          You&apos;re on the list
        </h3>
        <p className="text-green-700">
          We&apos;ve sent a confirmation link to <strong>{successEmail}</strong>.
        </p>
        <p className="text-sm text-green-600 mt-2">
          Confirming helps us keep the newsletter focused and spam-free.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="newsletter-email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="you@example.com"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      <div>
        <label htmlFor="newsletter-organization" className="block text-sm font-medium text-gray-700 mb-1">
          Organization <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          id="newsletter-organization"
          value={formData.organization}
          onChange={(e) => handleChange('organization', e.target.value)}
          placeholder="Your organization or outlet"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="newsletter-role" className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-gray-400">(optional)</span>
        </label>
        <select
          id="newsletter-role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Interests</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {interestOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 hover:border-blue-300"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.interests.includes(option.value)}
                onChange={() => toggleInterest(option.value)}
                disabled={isLoading}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </>
        ) : (
          'Join the Newsletter'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        We send occasional updates on compliance trends. Unsubscribe anytime.
      </p>
    </form>
  )
}
