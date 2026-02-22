-- Database schema for SFDAN (Federal Funding Dashboard)
-- Run this in Supabase SQL Editor to set up the database

-- Table to cache USASpending.gov API responses
CREATE TABLE IF NOT EXISTS cached_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT UNIQUE NOT NULL,
    award_data JSONB NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_hash TEXT,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Table to track sync status
CREATE TABLE IF NOT EXISTS sync_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_sync TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    record_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for lead generation (Phase 4)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    organization TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Table for published content posts (Phase 7)
CREATE TABLE IF NOT EXISTS content_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    sections JSONB,
    insight_ids UUID[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
    is_gated BOOLEAN NOT NULL DEFAULT false,
    data_sources JSONB,
    published_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for automated insights (Phase 7)
CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    metrics JSONB NOT NULL,
    evidence JSONB NOT NULL,
    trigger_type TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review',
    auto_publish_eligible BOOLEAN NOT NULL DEFAULT false,
    fingerprint TEXT UNIQUE NOT NULL,
    period_start DATE,
    period_end DATE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Table for newsletter subscribers (Phase 7)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    organization TEXT,
    role TEXT,
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Add updated_at index and RLS policies for leads
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);

-- Enable Row Level Security
ALTER TABLE cached_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cached_awards_key ON cached_awards(cache_key);
CREATE INDEX IF NOT EXISTS idx_cached_awards_expires ON cached_awards(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_published_at ON content_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(type);
CREATE INDEX IF NOT EXISTS idx_insights_generated_at ON insights(generated_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);

-- ============================================
-- RLS Policies for leads table
-- ============================================

-- Allow anyone to create a lead (for initial sign-up via magic link)
CREATE POLICY "Anyone can create lead"
  ON leads FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read leads
CREATE POLICY "Auth users can read leads"
  ON leads FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own lead
CREATE POLICY "Users can update own lead"
  ON leads FOR UPDATE USING (auth.uid()::text = email);

-- ============================================
-- RLS Policies for content_posts table
-- ============================================

-- Allow anyone to read published content
CREATE POLICY "Public can read published content"
  ON content_posts FOR SELECT
  USING (status = 'published');

-- Allow service role full access for admin workflows
CREATE POLICY "Service role can manage content"
  ON content_posts FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for insights table
-- ============================================

-- Allow authenticated users to read insights
CREATE POLICY "Auth users can read insights"
  ON insights FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role inserts for insights
CREATE POLICY "Service role can insert insights"
  ON insights FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create function to auto-update updated_at

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at_trigger
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_updated_at_trigger
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- ============================================
-- RLS Policies for newsletter_subscribers table
-- ============================================

-- Allow anyone to create a newsletter signup
CREATE POLICY "Anyone can create newsletter subscriber"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read newsletter subscribers
CREATE POLICY "Auth users can read newsletter subscribers"
  ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update their own subscriber record
CREATE POLICY "Users can update own newsletter subscriber"
  ON newsletter_subscribers FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() ->> 'email') = email
  );

-- Create function to clean expired cache
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM cached_awards WHERE expires_at < NOW();
END;
$$;

-- Create view for sync status
CREATE OR REPLACE VIEW latest_sync AS
SELECT * FROM sync_status ORDER BY created_at DESC LIMIT 1;
