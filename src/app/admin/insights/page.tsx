// src/app/admin/insights/page.tsx
'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { isAdminEmail } from '@/lib/admin'
import { AdminInsightsTable } from '@/components/AdminInsightsTable'

export default function AdminInsightsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user && isAdminEmail(user.email || '')) {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('status', 'pending_review')
          .order('generated_at', { ascending: false });
          
        if (!error && data) {
          setInsights(data);
        }
      }
      
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SFDAN
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    );
  }

  const userEmail = user?.email || '';
  const isAdmin = isAdminEmail(userEmail);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SFDAN
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Admin access required</h1>
          <p className="text-gray-600">
            You need to sign in with an approved admin email to review insights.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            SFDAN
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/content" className="text-blue-600 hover:text-blue-800">
              Findings
            </Link>
            <Link href="/newsletter" className="text-blue-600 hover:text-blue-800">
              Newsletter
            </Link>
            <Link href="/methodology" className="text-blue-600 hover:text-blue-800">
              Methodology
            </Link>
            <span className="text-gray-500">Admin Review</span>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Insights Review Queue</h1>
          <p className="text-gray-600 mt-2">
            Approve low-risk insights for publishing. Approved insights publish immediately.
          </p>
        </div>

        <AdminInsightsTable insights={insights || []} adminEmail={userEmail} />
      </main>
    </div>
  )
}
