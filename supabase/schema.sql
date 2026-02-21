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

-- Add updated_at index and RLS policies for leads
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);

-- Enable Row Level Security
ALTER TABLE cached_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cached_awards_key ON cached_awards(cache_key);
CREATE INDEX IF NOT EXISTS idx_cached_awards_expires ON cached_awards(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);

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
