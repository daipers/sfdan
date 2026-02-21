// Caching layer for USASpending.gov API responses
// Uses Supabase as the cache backend

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (only on server side)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    // Return null if not configured - will fall back to API-only mode
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export interface CacheEntry {
  id: string;
  cache_key: string;
  award_data: any;
  fetched_at: string;
  data_hash: string;
  expires_at: string | null;
}

/**
 * Generate a cache key from parameters
 */
function generateCacheKey(prefix: string, params: any): string {
  const paramString = JSON.stringify(params);
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < paramString.length; i++) {
    const char = paramString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${prefix}_${hash.toString(16)}`;
}

/**
 * Get cached data if it exists and hasn't expired
 */
export async function getCached(key: string): Promise<any | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null; // No cache configured
  }

  try {
    const { data, error } = await supabase
      .from('cached_awards')
      .select('award_data, fetched_at, expires_at')
      .eq('cache_key', key)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if cache has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      // Cache expired, invalidate it
      await invalidateCache(key);
      return null;
    }

    return data.award_data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Store data in cache with TTL
 */
export async function setCached(
  key: string, 
  data: any, 
  ttlSeconds: number = 3600
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return; // No cache configured
  }

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const dataHash = JSON.stringify(data).slice(0, 1000); // Truncate for storage

  try {
    const { error } = await supabase
      .from('cached_awards')
      .upsert({
        cache_key: key,
        award_data: data,
        fetched_at: new Date().toISOString(),
        data_hash: dataHash,
        expires_at: expiresAt,
      }, {
        onConflict: 'cache_key',
      });

    if (error) {
      console.error('Cache set error:', error);
    }
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Invalidate a specific cache entry
 */
export async function invalidateCache(key: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  try {
    await supabase
      .from('cached_awards')
      .delete()
      .eq('cache_key', key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Clear all expired cache entries
 */
export async function cleanExpiredCache(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('cached_awards')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      console.error('Cache clean error:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Cache clean error:', error);
    return 0;
  }
}

/**
 * Wrapper function to fetch with caching
 * Handles rate limiting by falling back to cache
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 3600,
  maxRetries: number = 3
): Promise<{ data: T | null; fromCache: boolean; error: string | null }> {
  // Try cache first
  const cached = await getCached(key);
  if (cached) {
    return { data: cached, fromCache: true, error: null };
  }

  // Fetch from API with retry logic
  let lastError: Error | null = null;
  let delay = 1000; // Start with 1 second delay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await fetchFn();
      
      // Cache the successful response
      await setCached(key, data, ttlSeconds);
      
      return { data, fromCache: false, error: null };
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error (429)
      const isRateLimit = error?.status === 429 || error?.message?.includes('429');
      
      if (!isRateLimit) {
        // Not a rate limit - try to get from cache as fallback
        const cachedFallback = await getCached(key);
        if (cachedFallback) {
          return { 
            data: cachedFallback, 
            fromCache: true, 
            error: 'Using cached data due to API error' 
          };
        }
        return { data: null, fromCache: false, error: error.message };
      }
      
      // Rate limited - wait and retry with exponential backoff
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  // All retries exhausted - try cache as last resort
  const cachedFallback = await getCached(key);
  if (cachedFallback) {
    return { 
      data: cachedFallback, 
      fromCache: true, 
      error: 'Using cached data due to rate limiting' 
    };
  }

  return { 
    data: null, 
    fromCache: false, 
    error: lastError?.message || 'Failed to fetch data after retries' 
  };
}
