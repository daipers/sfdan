// src/components/ProjectTimeline.tsx
'use client'

interface ProjectTimelineProps {
  award: {
    'Start Date'?: string | null | undefined
    'End Date'?: string | null | undefined
    periodOfPerformanceStartDate?: string | null | undefined
    periodOfPerformanceEndDate?: string | null | undefined
    lastModifiedDate?: string | null | undefined
    actionDate?: string | null | undefined
  }
  dataAsOf?: string
}

interface TimelineEvent {
  label: string
  date: string | null
  isPast: boolean
  isLast?: boolean
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

function isDatePast(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  try {
    return new Date(dateStr) < new Date()
  } catch {
    return false
  }
}

export function ProjectTimeline({ award, dataAsOf }: ProjectTimelineProps) {
  const today = new Date()
  
  // Gather all potential timeline dates
  const events: TimelineEvent[] = [
    {
      label: 'Period of Performance Start',
      date: award['Start Date'] || award.periodOfPerformanceStartDate || null,
      isPast: isDatePast(award['Start Date'] || award.periodOfPerformanceStartDate),
    },
    {
      label: 'Period of Performance End',
      date: award['End Date'] || award.periodOfPerformanceEndDate || null,
      isPast: isDatePast(award['End Date'] || award.periodOfPerformanceEndDate),
      isLast: true,
    },
  ]

  // Add last modified if available (but not as last item)
  if (award.lastModifiedDate) {
    events.splice(1, 0, {
      label: 'Last Modified',
      date: award.lastModifiedDate,
      isPast: isDatePast(award.lastModifiedDate),
    })
  }

  // Check if we have any valid dates
  const hasAnyDates = events.some(e => e.date && e.date !== 'N/A')

  // Determine data as of date
  const displayDataAsOf = dataAsOf || new Date().toISOString()

  return (
    <div className="relative">
      {!hasAnyDates ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No timeline data available for this project.</p>
          <p className="text-sm mt-1">The award may not have defined period of performance dates.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {events.map((event, index) => (
            <div 
              key={event.label} 
              className="relative flex gap-4"
              aria-label={`${event.label}: ${formatDate(event.date)}`}
            >
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                {/* Line above - only show if not first event or if there's a line needed */}
                {index > 0 && (
                  <div 
                    className="w-0.5 h-8 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                {index === 0 && events.length > 1 && (
                  <div 
                    className="w-0.5 h-8 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                
                {/* Dot */}
                <div 
                  className={`w-3 h-3 rounded-full border-2 z-10 flex-shrink-0 ${
                    event.date && event.date !== 'N/A'
                      ? event.isPast 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white border-blue-300'
                      : 'bg-gray-200 border-gray-300'
                  }`}
                  aria-hidden="true"
                />
                
                {/* Line below */}
                {!event.isLast && (
                  <div 
                    className="w-0.5 flex-1 bg-gray-200" 
                    aria-hidden="true"
                  />
                )}
              </div>
              
              {/* Event content */}
              <div className={`flex-1 pb-6 ${event.isLast ? 'pb-0' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-gray-900">{event.label}</h4>
                  {event.date && event.date !== 'N/A' && (
                    <span 
                      className={`text-sm ${
                        event.isPast ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(event.date)}
                    </span>
                  )}
                  {(!event.date || event.date === 'N/A') && (
                    <span className="text-sm text-gray-400 italic">Not specified</span>
                  )}
                </div>
                
                {/* Status indicator */}
                {event.date && event.date !== 'N/A' && (
                  <div className="mt-1">
                    {event.isPast ? (
                      <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Upcoming
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data as of note */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Data as of:</span> {new Date(displayDataAsOf).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Data refreshes daily from USASpending.gov
        </p>
      </div>
    </div>
  )
}
