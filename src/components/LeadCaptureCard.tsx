'use client'

import Link from 'next/link'
import { EmailGateForm } from '@/components/EmailGateForm'

type LeadCaptureMode = 'link' | 'form'

interface LeadCaptureCardProps {
  mode?: LeadCaptureMode
  title?: string
  description?: string
  linkHref?: string
  linkLabel?: string
  showOrganization?: boolean
}

export function LeadCaptureCard({
  mode = 'link',
  title = 'Get the full procedural compliance report',
  description = 'Unlock a detailed, shareable report with timeline risks, score drivers, and next-step recommendations.',
  linkHref = '/gated-reports',
  linkLabel = 'Request the full report',
  showOrganization = true,
}: LeadCaptureCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
            Next Step
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">{title}</h3>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
        {mode === 'form' ? (
          <div className="pt-2">
            <EmailGateForm showOrganization={showOrganization} />
          </div>
        ) : (
          <Link
            href={linkHref}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {linkLabel}
          </Link>
        )}
        <p className="text-xs text-gray-500">
          We&apos;ll send access details by email so you can download and share the report.
        </p>
      </div>
    </div>
  )
}
