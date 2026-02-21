// Data Currency Badge Component
// Displays when the data was last updated

import { format } from 'date-fns';

interface DataCurrencyBadgeProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export function DataCurrencyBadge({ lastUpdated, isLoading, error }: DataCurrencyBadgeProps) {
  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-gray-500">
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-amber-600">
        <svg 
          className="h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <span>Data may be outdated</span>
      </div>
    );
  }

  if (!lastUpdated) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-gray-500">
        <svg 
          className="h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span>Data update date unavailable</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
      <svg 
        className="h-4 w-4 text-green-600" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>
        Data as of {format(lastUpdated, 'MMM dd, yyyy')}
      </span>
    </div>
  );
}
