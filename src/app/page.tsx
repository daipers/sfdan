import { fetchAwards, fetchLastUpdated } from "@/lib/usaspending";
import { DataCurrencyBadge } from "@/components/DataCurrencyBadge";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let lastUpdated: Date | null = null;
  let awards: any[] = [];
  let error: string | null = null;

  try {
    const lastUpdatedData = await fetchLastUpdated();
    lastUpdated = lastUpdatedData ? new Date(lastUpdatedData) : null;
  } catch (e) {
    console.error('Failed to fetch last updated:', e);
  }

  try {
    const result = await fetchAwards();
    awards = result?.results || [];
  } catch (e) {
    console.error('Failed to fetch awards:', e);
    error = 'Unable to load award data. Please try again later.';
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Federal Funding Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Track IIJA infrastructure funding and procedural compliance
          </p>
          <DataCurrencyBadge 
            lastUpdated={lastUpdated} 
            isLoading={false}
            error={error}
          />
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : awards.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No award data available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.slice(0, 12).map((award: any) => (
              <div 
                key={award['Award ID']} 
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {award['Description'] || award['Award ID'] || 'Untitled Award'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {award['Recipient Name'] || 'Unknown Recipient'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-700">
                    ${(award['Award Amount'] || 0).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {award['Awarding Agency'] || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {awards.length > 0 && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Showing {Math.min(12, awards.length)} of {awards.length} awards
          </p>
        )}
      </div>
    </main>
  );
}
