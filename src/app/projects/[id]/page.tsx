// src/app/projects/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchAwardById, AwardData } from '@/lib/usaspending'
import { getScoreColorClass, getScoreDescription, getScoreExplanation } from '@/lib/scoring'
import { ProjectScoreBreakdown } from '@/components/ProjectScoreBreakdown'
import { ProjectTimeline } from '@/components/ProjectTimeline'
import { LeadCaptureCard } from '@/components/LeadCaptureCard'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we need to pre-define possible project IDs
  // Since projects are dynamic from API, we'll use sample IDs
  return [
    { id: '123456' },
    { id: '234567' },
    { id: '345678' },
    { id: '456789' },
    { id: '567890' }
  ];
}

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

async function getAwardData(awardId: string) {
  try {
    const award = await fetchAwardById(awardId)
    if (!award) return null
    return award
  } catch (error) {
    console.error('Error fetching award:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params
  return {
    title: `Project ${id} - Procedural Compliance Score`,
    description: `Detailed procedural compliance information for project ${id}`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const award = await getAwardData(id)
  
  if (!award) {
    notFound()
  }
  
  const score = award.score
  const hasScore = score && typeof score.total === 'number'
  
  // Format amount
  const formatAmount = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  // Format date
  const formatDate = (date?: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <AnalyticsTracker
        eventName="page_view"
        journey="project_detail"
        step="view"
        source="projects"
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {award['Description'] || award['Award ID'] || 'Untitled Project'}
              </h1>
              <p className="text-gray-600">
                Award ID: <span className="font-mono text-sm">{award['Award ID']}</span>
              </p>
              <p className="text-gray-600">
                Recipient: {award['Recipient Name'] || 'Unknown'}
              </p>
            </div>
            
            {/* Score Badge */}
            {hasScore && (
              <div className="flex flex-col items-start md:items-end">
                <div 
                  className={`px-4 py-2 rounded-lg text-2xl font-bold border ${getScoreColorClass(score.total)}`}
                  title={getScoreExplanation(score)}
                >
                  {score.total}
                </div>
                <span className="text-sm text-gray-500 mt-1">
                  {getScoreDescription(score.total)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Award Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Award Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Awarding Agency</dt>
                  <dd className="text-gray-900">{award['Awarding Agency'] || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Funding Agency</dt>
                  <dd className="text-gray-900">{award['Funding Agency'] || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Award Amount</dt>
                  <dd className="text-gray-900 font-semibold text-green-700">
                    {formatAmount(award['Award Amount'])}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assistance Type</dt>
                  <dd className="text-gray-900">{award['Assistance Type'] || 'N/A'}</dd>
                </div>
              </dl>
            </div>
            
            {/* Timeline Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
              <ProjectTimeline award={award} />
            </div>
            
            {/* Score Breakdown Card */}
            {hasScore && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Score Breakdown</h2>
                <ProjectScoreBreakdown score={score} />
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <LeadCaptureCard
              title="Request the detailed compliance report"
              description="See a full procedural audit with score drivers, timeline risks, and tailored next steps for this award."
              linkLabel="Get the full report"
              journey="project_detail"
              step="report_cta"
              source="project_detail"
            />
            {/* Source Data Link */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Source Data</h2>
              <p className="text-sm text-gray-600 mb-4">
                View this award on USASpending.gov for complete federal spending data.
              </p>
              <a
                href={`https://www.usaspending.gov/award/${encodeURIComponent(award['Award ID'])}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View on USASpending.gov
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            {/* Data Currency */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-2">Data Currency</h2>
              <p className="text-sm text-gray-600">
                Data is pulled daily from USASpending.gov API. Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
