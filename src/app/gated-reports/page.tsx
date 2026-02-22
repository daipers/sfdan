// src/app/gated-reports/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EmailGateForm } from '@/components/EmailGateForm'
import { createClient, getSession, signOut } from '@/lib/supabase'

interface Report {
  id: string
  title: string
  description: string
  date: string
  size: string
  category: string
}

// Mock reports data - in production this would come from a database or CMS
const availableReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2025 Infrastructure Spending Analysis',
    description: 'Comprehensive analysis of IIJA spending patterns in Q4 2025',
    date: '2025-12-15',
    size: '2.4 MB',
    category: 'Quarterly Report',
  },
  {
    id: '2',
    title: 'State-by-State Compliance Scorecard',
    description: 'Detailed breakdown of procedural compliance by state',
    date: '2025-11-20',
    size: '1.8 MB',
    category: 'Research',
  },
  {
    id: '3',
    title: 'Environmental Review Delays Investigation',
    description: 'Investigative report on NEPA review timeline delays',
    date: '2025-10-05',
    size: '3.1 MB',
    category: 'Investigation',
  },
  {
    id: '4',
    title: 'Rural vs Urban Funding Distribution',
    description: 'Analysis of how IIJA funds are distributed between rural and urban areas',
    date: '2025-09-12',
    size: '1.2 MB',
    category: 'Research',
  },
]

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
          {report.category}
        </span>
        <span className="text-xs text-gray-400">{report.size}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{report.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(report.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          Download PDF
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function GatedReportsPage() {
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
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {!isAuthenticated ? (
          // Show gate form
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Access Detailed Reports
              </h1>
              <p className="text-gray-600">
                Enter your email to receive a magic link and access our collection of 
                investigative reports and analyses on federal infrastructure spending.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <EmailGateForm showOrganization={true} />
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => {/* Trigger magic link resend */}}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        ) : (
          // Show reports
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Reports
                </h1>
                <p className="text-gray-600">
                  Welcome back! You have access to the following detailed reports.
                </p>
              </div>
              {userEmail && (
                <div className="text-sm text-gray-500">
                  Signed in as <span className="font-medium text-gray-700">{userEmail}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableReports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Need a custom report?</strong>{' '}
                Contact us at{' '}
                <a href="mailto:reports@sfdan.org" className="underline">
                  reports@sfdan.org
                </a>{' '}
                to request a tailored analysis.
              </p>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
