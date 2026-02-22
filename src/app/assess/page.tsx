// src/app/assess/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AssessmentWizard } from '@/components/AssessmentWizard'
import { EmailGateForm } from '@/components/EmailGateForm'
import { createClient, getSession, signOut } from '@/lib/supabase'

export default function AssessPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const session = await getSession()
        if (session?.user) {
          setIsAuthenticated(true)
          setUserEmail(session.user.email || null)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setIsAuthenticated(!!session?.user)
      setUserEmail(session?.user?.email || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsAuthenticated(false)
    setUserEmail(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            SFDAN
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/methodology" className="text-blue-600 hover:text-blue-800">
              Methodology
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/gated-reports"
                className="text-blue-600 hover:text-blue-800"
              >
                Reports
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!isAuthenticated ? (
          // Show email gate
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assess Your Project
              </h1>
              <p className="text-gray-600">
                Enter your email to access the self-assessment tool. 
                Evaluate your federal award for procedural compliance.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <EmailGateForm showOrganization={true} />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2">
                Why sign in?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Get your private compliance score</li>
                <li>• Compare against public benchmarks</li>
                <li>• Receive personalized recommendations</li>
                <li>• Your data stays private and is never stored</li>
              </ul>
            </div>
          </div>
        ) : (
          // Show assessment wizard
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Self-Assessment Tool
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Evaluate your project's procedural compliance using the same methodology 
                applied to public IIJA award data. Your results are private and never shared.
              </p>
              {userEmail && (
                <p className="text-sm text-gray-500 mt-2">
                  Signed in as <span className="font-medium">{userEmail}</span>
                </p>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">Private</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your project data is processed locally and never stored or shared.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">Benchmark</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Compare your score against the public average of 68.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">Actionable</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Get specific recommendations to improve compliance.
                </p>
              </div>
            </div>

            {/* Assessment Wizard */}
            <AssessmentWizard />

            {/* Methodology Link */}
            <div className="text-center mt-8">
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Learn more about our scoring methodology
              </Link>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
