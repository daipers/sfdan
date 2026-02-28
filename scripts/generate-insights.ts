import { createClient } from '@supabase/supabase-js'
import { fetchAwards } from '@/lib/usaspending'
import { generateInsights } from '@/lib/insights'

// Force fetch to be available in Node environment if needed, 
// though Node 18+ has it and Next.js/tsx should handle it.
// If fetch is missing, we might need a polyfill, but let's assume Node 18+.

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('Initializing Supabase client...')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Fetching IIJA projects from USASpending...')
    // Fetch 100+ projects as specified in the plan
    const { results: awards } = await fetchAwards({ pageSize: 150 })
    
    if (!awards || awards.length === 0) {
      console.log('No awards found.')
      return
    }

    console.log(`Generating insights from ${awards.length} awards...`)
    const insights = generateInsights(awards)

    if (insights.length === 0) {
      console.log('No insights generated.')
      return
    }

    console.log(`Upserting ${insights.length} insights to Supabase...`)
    const { data, error } = await supabase
      .from('insights')
      .upsert(insights, { onConflict: 'fingerprint' })

    if (error) {
      throw error
    }

    console.log('Successfully updated insights.')
  } catch (err) {
    console.error('Error generating or uploading insights:', err)
    process.exit(1)
  }
}

main()
