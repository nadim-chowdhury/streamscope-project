import axios from 'axios';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { prisma } from '../prisma';
import { z } from 'zod';

const MovieSchema = z.object({
  title: z.string(),
  slug: z.string(),
  poster: z.string().optional(),
  description: z.string().optional(),
  year: z.number().optional(),
  imdbRating: z.number().optional(),
  quality: z.string().optional(),
  sourceUrl: z.string(),
  genres: z.array(z.string()),
  servers: z.array(z.object({
    name: z.string(),
    url: z.string()
  }))
});

export type ScrapedMovie = z.infer<typeof MovieSchema>;

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * MOCK SIMULATION FOR TESTING & DEMONSTRATION
 */
async function runMockScraper(url: string) {
  console.log(`[Scraper] Simulating scraping on: ${url}`);
  
  const mockMovies: ScrapedMovie[] = [
    {
      title: "Inception",
      slug: "inception",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
      year: 2010,
      imdbRating: 8.8,
      quality: "4K UHD",
      sourceUrl: url,
      genres: ["Action", "Sci-Fi", "Adventure"],
      servers: [
        { name: "AlphaStream (4K)", url: "https://www.youtube.com/embed/8hP9D6kZseM" },
        { name: "BetaStream (1080p)", url: "https://www.youtube.com/embed/YoHD9XEInc0" }
      ]
    },
    {
      title: "Interstellar",
      slug: "interstellar",
      poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80",
      description: "When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.",
      year: 2014,
      imdbRating: 8.7,
      quality: "1080p FHD",
      sourceUrl: url,
      genres: ["Adventure", "Drama", "Sci-Fi"],
      servers: [
        { name: "Prime Server", url: "https://www.youtube.com/embed/zSWdZAZE3Tk" },
        { name: "Backup Server", url: "https://www.youtube.com/embed/2LqzF5WauAw" }
      ]
    },
    {
      title: "The Dark Knight",
      slug: "the-dark-knight",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      year: 2008,
      imdbRating: 9.0,
      quality: "4K UHD",
      sourceUrl: url,
      genres: ["Action", "Crime", "Drama"],
      servers: [
        { name: "Main Server", url: "https://www.youtube.com/embed/EXeTwQWrcwY" }
      ]
    },
    {
      title: "The Matrix",
      slug: "the-matrix",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
      description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
      year: 1999,
      imdbRating: 8.7,
      quality: "1080p FHD",
      sourceUrl: url,
      genres: ["Action", "Sci-Fi"],
      servers: [
        { name: "Main Stream", url: "https://www.youtube.com/embed/vKQi3bBA1y8" }
      ]
    }
  ];

  for (const movie of mockMovies) {
    await saveMovie(movie);
    console.log(`[Scraper] Successfully indexed and saved: ${movie.title}`);
  }
}

/**
 * Option 1: Simple Sites (Cheerio)
 * Best for sites that render HTML on the server.
 * 
 * TO ADD A NEW WEBSITE:
 * 1. Inspect the target site's HTML layout.
 * 2. Create custom parsing selectors in a switch/if branch based on the URL domain.
 * 3. Extract the list of movie items, fetch their detail pages if needed, and map to ScrapedMovie.
 * 4. Call `saveMovie(movieData)` to upsert into database.
 */
export async function scrapeWithCheerio(url: string) {
  try {
    if (url.includes('example') || url.includes('test')) {
      await runMockScraper(url);
      return;
    }

    console.log(`Cheerio: Fetching HTML from ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    
    // ==========================================
    // CUSTOM PARSING TEMPLATE (e.g. for MyMovieSite.com)
    // ==========================================
    // const movies: ScrapedMovie[] = [];
    // $('.movie-card').each((i, element) => {
    //   const title = $(element).find('.movie-title').text().trim();
    //   const slug = slugify(title);
    //   const poster = $(element).find('img').attr('src');
    //   const year = parseInt($(element).find('.movie-year').text()) || undefined;
    //   const quality = $(element).find('.quality-tag').text().trim() || 'HD';
    //   const detailUrl = $(element).find('a').attr('href') || '';
    //
    //   movies.push({
    //     title,
    //     slug,
    //     poster,
    //     year,
    //     quality,
    //     sourceUrl: detailUrl,
    //     genres: ['Scraped'],
    //     servers: [{ name: 'Default Stream', url: detailUrl }]
    //   });
    // });
    //
    // for (const m of movies) {
    //   await saveMovie(m);
    // }
    
  } catch (error) {
    console.error('Cheerio scraping error:', error);
  }
}

/**
 * Option 2: Protected/JS-Heavy Sites (Playwright)
 * Best for sites that use Cloudflare protection, React/Vue client rendering, or obfuscated stream frames.
 */
export async function scrapeWithPlaywright(url: string) {
  if (url.includes('example') || url.includes('test')) {
    await runMockScraper(url);
    return;
  }

  console.log(`Playwright: Spawning headless browser for ${url}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    console.log(`Playwright loaded page content successfully for ${url}`);
    
    // Custom Parsing logic goes here (similar to Cheerio above)
    
  } catch (error) {
    console.error('Playwright scraping error:', error);
  } finally {
    await browser.close();
  }
}

export async function scrapeMovies(url: string, usePlaywright = false) {
  if (usePlaywright) {
    return await scrapeWithPlaywright(url);
  }
  return await scrapeWithCheerio(url);
}

export async function saveMovie(movieData: ScrapedMovie) {
  const { genres, servers, ...movie } = movieData;

  return await prisma.movie.upsert({
    where: { slug: movie.slug },
    update: {
      ...movie,
      genres: {
        deleteMany: {},
        create: await Promise.all(genres.map(async (name) => {
          const genre = await prisma.genre.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          return { genreId: genre.id };
        })),
      },
      servers: {
        deleteMany: {},
        create: servers,
      },
    },
    create: {
      ...movie,
      genres: {
        create: await Promise.all(genres.map(async (name) => {
          const genre = await prisma.genre.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          return { genreId: genre.id };
        })),
      },
      servers: {
        create: servers,
      },
    },
  });
}
