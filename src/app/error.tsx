'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          An error occurred while loading this page.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 rounded p-3 mb-4 overflow-auto">
            <pre className="text-xs text-red-800 whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\nStack:\n${error.stack}`}
            </pre>
          </div>
        )}
        {error.digest && (
          <p className="text-xs text-gray-500 mb-4">
            Error digest: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
