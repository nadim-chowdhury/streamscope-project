import cron from 'node-cron'
import { scrapeMovies } from './scraper/scraper'

// Run every 6 hours as per requirements
export function initScheduler() {
  console.log('Initializing Movie Update Scheduler...')
  
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running scheduled movie scrape...')
    try {
      // In a real scenario, you'd have a list of URLs to scrape
      await scrapeMovies('https://example-movie-site.com/latest')
      console.log('Scheduled scrape completed successfully.')
    } catch (error) {
      console.error('Scheduled scrape failed:', error)
    }
  })
}
