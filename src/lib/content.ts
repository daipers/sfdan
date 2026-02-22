// src/lib/content.ts
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdminClient } from './admin'

export type ContentStatus = 'draft' | 'review' | 'published'

export interface ContentSectionData {
  executiveSummary?: string
  keyFindings?: string[]
  methodology?: string
  dataHighlights?: Array<{ label: string; value: string; note?: string }>
  citations?: string[]
  dataSources?: string[]
  contentType?: string
  tags?: string[]
  agencies?: string[]
  states?: string[]
}

export interface ContentPost {
  id: string
  slug: string
  title: string
  summary: string | null
  sections: ContentSectionData | null
  insight_ids: string[] | null
  status: ContentStatus
  is_gated: boolean
  data_sources: Record<string, unknown> | null
  published_at: string | null
  approved_at: string | null
  approved_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ContentFilters {
  query?: string
  type?: string
  agency?: string
  state?: string
  dateFrom?: string
  dateTo?: string
  tag?: string
}

export interface InsightRecord {
  id: string
  title: string
  summary: string
  metrics?: Record<string, unknown>
  evidence?: Record<string, unknown>
  type?: string
  risk_level?: string
  auto_publish_eligible?: boolean
  generated_at?: string
}

function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase public environment variables not configured')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

function matchesFilters(post: ContentPost, filters: ContentFilters): boolean {
  const sections = post.sections || {}
  const contentType = sections.contentType || ''
  const agencies = sections.agencies || []
  const states = sections.states || []
  const tags = sections.tags || []

  if (filters.type && contentType.toLowerCase() !== filters.type.toLowerCase()) {
    return false
  }

  if (filters.agency && !agencies.map((item) => item.toLowerCase()).includes(filters.agency.toLowerCase())) {
    return false
  }

  if (filters.state && !states.map((item) => item.toLowerCase()).includes(filters.state.toLowerCase())) {
    return false
  }

  if (filters.tag && !tags.map((item) => item.toLowerCase()).includes(filters.tag.toLowerCase())) {
    return false
  }

  return true
}

export async function getPublishedContent(filters: ContentFilters = {}): Promise<ContentPost[]> {
  const supabase = createPublicClient()
  if (!supabase) return []

  let query = supabase
    .from('content_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (filters.dateFrom) {
    query = query.gte('published_at', filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte('published_at', filters.dateTo)
  }

  if (filters.query) {
    const q = filters.query.trim()
    if (q) {
      query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
    }
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error fetching content posts:', error)
    return []
  }

  return (data as ContentPost[]).filter((post) => matchesFilters(post, filters))
}

export async function getContentBySlug(slug: string): Promise<ContentPost | null> {
  const supabase = createPublicClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('content_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching content post:', error)
    return null
  }

  return data as ContentPost
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

export async function createContentDraftFromInsight(insight: InsightRecord) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) return null

  const sections: ContentSectionData = {
    executiveSummary: insight.summary,
    keyFindings: [insight.summary],
    methodology: 'Derived from automated procedural compliance insight generation.',
    dataHighlights: Object.entries(insight.metrics || {}).map(([label, value]) => ({
      label,
      value: String(value),
    })),
    citations: [],
    dataSources: [],
    contentType: insight.type || 'insight',
    tags: [insight.risk_level || 'unspecified'],
  }

  const { data, error } = await supabase
    .from('content_posts')
    .insert({
      slug: slugifyTitle(insight.title),
      title: insight.title,
      summary: insight.summary,
      sections,
      insight_ids: [insight.id],
      status: 'draft',
      is_gated: true,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('Error creating content draft:', error)
    return null
  }

  return data as ContentPost
}

export async function publishContent(id: string, approvedBy?: string | null) {
  const supabase = createSupabaseAdminClient()
  if (!supabase) return null

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('content_posts')
    .update({
      status: 'published',
      published_at: now,
      approved_at: now,
      approved_by: approvedBy || null,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    console.error('Error publishing content:', error)
    return null
  }

  return data as ContentPost
}
