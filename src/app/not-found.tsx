import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Branding */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SFDAN
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            State Fiscal Data Analysis Network
          </p>
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            This page doesn&apos;t exist
          </h2>
          
          <p className="text-gray-600 mb-6">
            The page you&apos;re looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>

          {/* Navigation Links */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Return to Dashboard
            </Link>
            
            <Link
              href="/methodology"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              View Methodology
            </Link>
            
            <Link
              href="/assess"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Assess Your Project
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500">
          Need help? <Link href="/faq" className="text-blue-600 hover:underline">Visit our FAQ</Link>
        </p>
      </div>
    </div>
  )
}
