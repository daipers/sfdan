'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Supabase client handles the code exchange automatically 
        // when getSession() is called if the code is in the URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error.message)
        }

        const redirectTo = searchParams.get('redirectTo') || '/'
        
        // Use a small delay to ensure the session is persisted in local storage
        // before navigating away, especially for static hosting
        setTimeout(() => {
          router.push(redirectTo)
        }, 500)
      } catch (err) {
        console.error('Unexpected auth callback error:', err)
        router.push('/')
      }
    }

    handleAuth()
  }, [router, supabase.auth, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mb-4"></div>
      <h1 className="text-xl font-semibold mb-2">Finishing sign-in...</h1>
      <p className="text-gray-600">Please wait while we restore your session.</p>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Loading...</h1>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
