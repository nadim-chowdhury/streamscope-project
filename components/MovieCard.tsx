import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MovieCardProps {
  movie: {
    id: string
    title: string
    slug: string
    poster?: string
    year?: number
    imdbRating?: number
    quality?: string
    genres: { genre: { name: string } }[]
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group">
      <Card className="h-full overflow-hidden bg-card/45 border-border/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:border-primary/30 flex flex-col">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 15vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-xs font-semibold">No Poster</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {movie.quality && (
            <Badge className="absolute left-2.5 top-2.5 bg-yellow-500/90 text-black border-none font-bold text-[10px] tracking-wider px-1.5 py-0.5 rounded-sm">
              {movie.quality}
            </Badge>
          )}
          {movie.imdbRating && (
            <Badge className="absolute right-2.5 top-2.5 bg-background/80 backdrop-blur-md text-yellow-500 border border-yellow-500/20 font-bold text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
              ⭐ {movie.imdbRating}
            </Badge>
          )}
        </div>
        <CardContent className="p-3 flex-1 flex flex-col justify-between">
          <h3 className="line-clamp-1 font-bold text-sm text-foreground/90 group-hover:text-primary transition-colors duration-200">{movie.title}</h3>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{movie.year || 'N/A'}</span>
            <span className="line-clamp-1 max-w-[70%] font-medium">
              {movie.genres.map(g => g.genre.name).join(', ')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
