'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useGetMovieBySlugQuery, useGetSimilarMoviesQuery } from '@/features/api/moviesApi'
import { MovieCard } from '@/components/MovieCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlayIcon, Download01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'

export default function MovieDetailsClient({ slug }: { slug: string }) {
  const { data: movie, isLoading, error } = useGetMovieBySlugQuery(slug)
  const { data: similarMovies, isLoading: isSimilarLoading } = useGetSimilarMoviesQuery(slug)
  const [activeServer, setActiveServer] = useState<any>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const handleStartWatch = (server: any) => {
    setActiveServer(server)
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Background Backdrop */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-background/90">
          {movie.poster && (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover opacity-15 blur-2xl"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="container relative z-10 mx-auto h-full flex flex-col justify-end px-4 pb-12">
          <div className="grid md:grid-cols-[280px_1fr] gap-10 items-end">
            <div className="hidden md:block relative aspect-[2/3] w-[280px] rounded-xl overflow-hidden shadow-2xl border border-border/40">
              {movie.poster ? (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">No Poster</div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g: any) => (
                    <Badge key={g.genre.id} variant="secondary" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold">
                      {g.genre.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 text-zinc-300 font-semibold text-sm">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span className="text-yellow-500 flex items-center gap-1">⭐ {movie.imdbRating} IMDB</span>
                  <span>•</span>
                  <Badge className="bg-primary/90 text-white font-bold">{movie.quality}</Badge>
                </div>
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {movie.description || 'No description available for this movie.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 gap-2 font-bold hover:scale-105 transition-all shadow-lg shadow-primary/25"
                  onClick={() => {
                    if (movie.servers.length > 0) {
                      handleStartWatch(movie.servers[0]);
                    }
                  }}
                  disabled={movie.servers.length === 0}
                >
                  <HugeiconsIcon icon={PlayIcon} /> Watch Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 border-border/60 hover:bg-muted text-foreground transition-all">
                  <HugeiconsIcon icon={Download01Icon} /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Container */}
      {activeServer && (
        <section ref={playerRef} className="container mx-auto px-4 mt-8 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between bg-card/45 border border-border/65 p-4 rounded-xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-bold text-foreground/90">
                Playing from server: <span className="text-primary">{activeServer.name}</span>
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveServer(null)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/80 gap-1.5"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} /> Close Player
            </Button>
          </div>
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/60">
            {activeServer.url ? (
              <iframe
                src={activeServer.url}
                className="w-full h-full border-none"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6 bg-zinc-950">
                <HugeiconsIcon icon={PlayIcon} className="h-16 w-16 text-primary animate-pulse" />
                <h3 className="text-xl font-bold">Connecting to {activeServer.name}...</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Initializing the video stream. Please wait a moment.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Watch Servers Section */}
      <section className="container mx-auto px-4 mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Streaming Servers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movie.servers.map((server: any) => (
            <Card 
              key={server.id} 
              className={`bg-card/45 border-border/60 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/5 ${activeServer?.id === server.id ? 'ring-2 ring-primary border-transparent' : ''}`}
              onClick={() => handleStartWatch(server)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <HugeiconsIcon icon={PlayIcon} className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground/90 group-hover:text-primary transition-colors">{server.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">Fast Streaming</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-primary hover:text-primary hover:bg-primary/10 font-bold"
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          ))}
          {movie.servers.length === 0 && (
            <p className="text-muted-foreground col-span-full">No watch servers available yet.</p>
          )}
        </div>
      </section>

      {/* Similar Movies Section */}
      <section className="container mx-auto px-4 mt-16 space-y-6">
        <h2 className="text-2xl font-bold">Similar Movies</h2>
        {isSimilarLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {similarMovies?.map((m: any) => (
              <MovieCard key={m.id} movie={m} />
            ))}
            {similarMovies?.length === 0 && (
              <p className="text-muted-foreground col-span-full">No similar movies found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
