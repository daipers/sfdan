'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { NewsletterSignupForm } from '@/components/NewsletterSignupForm'

interface GatedContentWrapperProps {
  children: React.ReactNode
  isInitiallyGated: boolean
}

export function GatedContentWrapper({
  children,
  isInitiallyGated,
}: GatedContentWrapperProps) {
  const [isUnlocked, setIsUnlocked] = useState(!isInitiallyGated)
  const [isLoading, setIsLoading] = useState(isInitiallyGated)
  const supabase = createClient()

  useEffect(() => {
    if (!isInitiallyGated) {
      setIsLoading(false)
      return
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsUnlocked(true)
        }
      } catch (error) {
        console.error('Error checking auth session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session) {
        setIsUnlocked(true)
      } else {
        setIsUnlocked(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isInitiallyGated, supabase.auth])

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 text-sm">Verifying access...</p>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm border-l-4 border-l-blue-600 animate-in fade-in duration-500">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Premium Content
          </h2>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Subscribe to unlock the full report
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Get access to executive summaries, full findings, and methodology notes. Join our community of watchdogs.
        </p>
        <NewsletterSignupForm />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      {children}
    </div>
  )
}
