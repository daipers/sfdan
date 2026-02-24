// src/app/api/content/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Force static export for GitHub Pages compatibility
export const dynamic = "force-static";

// Generate static params for export - this won't be functional on GitHub Pages
export async function generateStaticParams() {
  return [
    { slug: 'placeholder' }
  ];
}

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  // Static export - this API won't be functional on GitHub Pages
  // Return a static response for build compatibility
  return NextResponse.json({ 
    message: 'API routes are not available in static export mode',
    availableIn: 'server-side deployment only'
  });
}
