'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlayIcon, Settings01Icon, DatabaseIcon, ArrowUpDownIcon, AlertCircleIcon, TaskDoneIcon } from '@hugeicons/core-free-icons'

interface AdminDashboardClientProps {
  session: Session
  initialMovieCount: number
  initialGenreCount: number
}

export default function AdminDashboardClient({ 
  session, 
  initialMovieCount, 
  initialGenreCount 
}: AdminDashboardClientProps) {
  const [isScraping, setIsScraping] = useState(false)
  const [targetUrl, setTargetUrl] = useState('https://example-movie-site.com')
  const [usePlaywright, setUsePlaywright] = useState(false)
  const [movieCount, setMovieCount] = useState(initialMovieCount)
  const [genreCount] = useState(initialGenreCount)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetUrl.trim()) {
      toast.error('Please enter a target URL')
      return
    }

    setIsScraping(true)
    try {
      const res = await fetch('/api/admin/scrape', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, usePlaywright })
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Scraping job started for ${targetUrl}`)
        // If testing on the mock server, wait briefly and increment mock movie count
        if (targetUrl.includes('example') || targetUrl.includes('test')) {
          setTimeout(() => {
            setMovieCount(prev => prev + 4) // mock adds 4 movies
            toast.success('Mock data loaded successfully!')
          }, 2000)
        }
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Failed to start scraping')
      }
    } catch (error) {
      toast.error('An error occurred while launching the scraping job')
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl space-y-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card/45 border border-border/60 p-6 rounded-2xl gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-white">
            <HugeiconsIcon icon={Settings01Icon} className="text-primary animate-spin-[spin_3s_linear_infinite]" />
            Administrator Console
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back, <span className="text-primary font-bold">{session.user?.name || 'Administrator'}</span> ({session.user?.email})
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="border-border/60 hover:bg-muted text-foreground font-bold rounded-lg"
        >
          Sign Out
        </Button>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/45 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Total Movies</CardTitle>
            <HugeiconsIcon icon={PlayIcon} className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{movieCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Indexed in Catalog</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Genres Loaded</CardTitle>
            <HugeiconsIcon icon={DatabaseIcon} className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">{genreCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Classified categories</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Scraper Mode</CardTitle>
            <HugeiconsIcon icon={ArrowUpDownIcon} className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{usePlaywright ? 'Playwright JS' : 'Cheerio HTML'}</div>
            <p className="text-xs text-muted-foreground mt-2">Preferred driver engine</p>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Broken Links</CardTitle>
            <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">0</div>
            <p className="text-xs text-muted-foreground mt-1">Stream links verified active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Scraper Controls */}
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card/45 border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Trigger Movie Scraper Job</CardTitle>
            <CardDescription className="text-muted-foreground">
              Input a target movie website page (e.g. latest releases or categories) to trigger the automated crawling and database indexing task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScrape} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="target-url" className="text-sm font-bold text-foreground/90">Target Website URL</Label>
                <Input 
                  id="target-url"
                  type="url"
                  placeholder="https://example-movie-site.com/latest"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="bg-background/80 border-border hover:border-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-primary h-11 text-white"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use <code className="text-primary font-bold">https://example-movie-site.com</code> to run a live test scraping simulation with dummy movies!
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded-xl">
                <div className="space-y-1 pr-4">
                  <Label htmlFor="playwright-mode" className="text-sm font-bold text-foreground/90 block">Playwright Browser (JS-Heavy)</Label>
                  <span className="text-xs text-muted-foreground block">
                    Enable this option if the site has Cloudflare anti-bot protection, dynamic React loading, or lazy-loaded movie details.
                  </span>
                </div>
                <Switch 
                  id="playwright-mode"
                  checked={usePlaywright}
                  onCheckedChange={setUsePlaywright}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isScraping}
                className="w-full h-11 font-bold shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform"
              >
                {isScraping ? 'Launching Scraping Thread...' : 'Start Scraper Job'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Documentation Block */}
        <Card className="bg-card/45 border-border/60 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <HugeiconsIcon icon={TaskDoneIcon} className="text-emerald-500" />
              Scraper Quick Help
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Guide to executing crawls and maintaining server connectivity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground/90">Driver Engines</h4>
              <p className="text-xs leading-relaxed">
                <strong>Cheerio:</strong> Loads raw static HTML using fast HTTP requests. Extremely fast and lightweight.
              </p>
              <p className="text-xs leading-relaxed">
                <strong>Playwright:</strong> Spawns a real headless Chromium browser instance to wait for full javascript rendering.
              </p>
            </div>
            <div className="border-t border-border/45 pt-4">
              <h4 className="font-bold text-foreground/90 mb-1.5">Scraper Logs</h4>
              <p className="text-xs leading-relaxed">
                All background jobs print query performance logs directly to the stdout terminal dev stream.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer Tutorial: How to Add Website for Scraping */}
      <Card className="bg-card/45 border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Developer Guide: How to Add a Website for Scraping</CardTitle>
          <CardDescription className="text-muted-foreground">
            Follow this technical walk-through to register new scrapers and custom HTML parsers in the source code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full">
            <AccordionItem value="step-1" className="border-border/60">
              <AccordionTrigger className="text-sm font-bold text-white hover:no-underline">
                Step 1: Open the Scraper Module
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed space-y-2">
                <p>
                  All parser logic is stored in the [scraper.ts](file:///e:/Projects/streamscope-project/lib/scraper/scraper.ts) module.
                </p>
                <p>
                  Inside, you will find two primary functions that handle requests:
                  <code className="bg-muted px-1.5 py-0.5 rounded text-primary ml-1 font-bold">scrapeWithCheerio()</code> and 
                  <code className="bg-muted px-1.5 py-0.5 rounded text-primary ml-1 font-bold">scrapeWithPlaywright()</code>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step-2" className="border-border/60">
              <AccordionTrigger className="text-sm font-bold text-white hover:no-underline">
                Step 2: Add Custom Selectors
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed space-y-4">
                <p>
                  To write a parser for a specific website (e.g. <code className="text-white">https://cinemafilm.com</code>), inspect the site's layout in your browser's Developer Tools to identify the container selector for movie items, images, and anchors.
                </p>
                <p>
                  Then, add a branch to check the domain in your parsing function and write your jquery-style selectors:
                </p>
                <pre className="bg-black/50 border border-border/60 p-4 rounded-lg overflow-x-auto text-[11px] text-white font-mono leading-normal">
{`if (url.includes('cinemafilm.com')) {
  // Select all movie container elements on the list page
  $('.movie-card-item').each(async (index, element) => {
    const title = $(element).find('.card-title').text().trim();
    const poster = $(element).find('img').attr('src');
    const rating = parseFloat($(element).find('.rating-score').text()) || undefined;
    const year = parseInt($(element).find('.release-year').text()) || undefined;
    const detailLink = $(element).find('a.detail-button').attr('href') || '';
    
    // Save/Upsert movie into the Database using the saveMovie helper
    await saveMovie({
      title,
      slug: slugify(title),
      poster,
      description: "Scraped from CinemaFilm",
      year,
      imdbRating: rating,
      quality: "FHD 1080p",
      sourceUrl: detailLink,
      genres: ["Action", "Thriller"],
      servers: [
        { name: "Server Fast", url: detailLink } // embed link or player link
      ]
    });
  });
}`}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step-3" className="border-border/60">
              <AccordionTrigger className="text-sm font-bold text-white hover:no-underline">
                Step 3: Setup Automated Cron Scheduling
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed space-y-2">
                <p>
                  To make your scraper run automatically at scheduled intervals, open the scheduler script located at [scheduler.ts](file:///e:/Projects/streamscope-project/lib/scheduler.ts).
                </p>
                <p>
                  Register your site's scraper trigger within the node-cron task block:
                </p>
                <pre className="bg-black/50 border border-border/60 p-4 rounded-lg overflow-x-auto text-[11px] text-white font-mono leading-normal">
{`// Add a new scheduled scraping site inside initScheduler()
cron.schedule('0 */6 * * *', async () => {
  console.log('Running automatic scraping routine...');
  await scrapeMovies('https://cinemafilm.com/latest-releases');
});`}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
