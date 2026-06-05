import { NextResponse } from 'next/server'
import { scrapeMovies } from '@/lib/scraper/scraper'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { url, usePlaywright = false } = body

    if (!url) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 })
    }
    
    // Trigger the scraper in the background to avoid timing out the API response
    scrapeMovies(url, usePlaywright).catch((error) => {
      console.error(`Background scraper job failed for ${url}:`, error)
    })
    
    return NextResponse.json({ 
      message: 'Scraping job started successfully',
      target: url,
      mode: usePlaywright ? 'Playwright' : 'Cheerio'
    })
  } catch (error) {
    console.error('Failed to initiate scraping:', error)
    return NextResponse.json({ error: 'Failed to start scraping' }, { status: 500 })
  }
}
