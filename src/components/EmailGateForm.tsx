// src/components/EmailGateForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { trackEvent } from '@/lib/analytics'

interface EmailGateFormProps {
  onSuccess?: () => void
  showOrganization?: boolean
  journey?: string
  step?: string
  source?: string
}

interface FormData {
  email: string
  organization: string
  role: string
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

export function EmailGateForm({
  onSuccess,
  showOrganization = true,
  journey = 'lead_capture',
  step = 'email_gate_submit',
  source = 'email_gate_form',
}: EmailGateFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    organization: '',
    role: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate email
    if (!formData.email || !validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          organization: formData.organization || undefined,
          role: formData.role || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link')
      }

      void trackEvent({
        eventName: 'form_submit',
        journey,
        step,
        source,
      })

      setSuccess(true)
      setFormData({ email: '', organization: '', role: '' })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
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
          Check your email!
        </h3>
        <p className="text-green-700">
          We&apos;ve sent a magic link to <strong>{formData.email || 'your email'}</strong>.
          Click the link to access the reports.
        </p>
        <p className="text-sm text-green-600 mt-2">
          The link will expire in 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="you@example.com"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>

      {showOrganization && (
        <>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="organization"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="Your organization or outlet"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-gray-400">(optional)</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

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
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending link...
          </>
        ) : (
          'Send Me a Magic Link'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By signing in, you agree to receive occasional updates about federal funding.
        We&apos;ll never share your email with third parties.
      </p>
    </form>
  )
}
