import { fetchAwards, fetchLastUpdated } from "@/lib/usaspending";
import { DataCurrencyBadge } from "@/components/DataCurrencyBadge";
import { AwardCard } from "@/components/AwardCard";
import Link from "next/link";

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Federal Funding Dashboard</h1>
              <p className="text-gray-600 mb-4">
                Track IIJA infrastructure funding and procedural compliance
              </p>
            </div>
            <Link 
              href="/methodology" 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Scoring Methodology
            </Link>
          </div>
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
              <AwardCard key={award['Award ID']} award={award} />
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
