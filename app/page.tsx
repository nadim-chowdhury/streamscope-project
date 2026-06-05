"use client";

import { useState, useEffect } from "react";
import { useGetMoviesQuery, useGetGenresQuery } from "@/features/api/moviesApi";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [page, setPage] = useState(1);

  const { data: genresData } = useGetGenresQuery();
  const { data, isLoading, isFetching } = useGetMoviesQuery({
    page,
    search,
    genre: genre === "all" ? undefined : genre,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && data && page < data.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [inView, data, page, isFetching]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleGenreChange = (value: string | null) => {
    setGenre(value || "all");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] w-full flex items-center justify-center text-white overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background border-b border-border/40">
        {/* Glow effect */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
        
        <div className="relative z-20 text-center space-y-6 max-w-3xl px-4">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent">
              StreamScope
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Discover and stream your favorite movies automatically indexed from around the web.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex gap-2"
          >
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 h-5 w-5"
              />
              <Input
                placeholder="Search movies by title, actors, genres..."
                className="pl-11 h-12 bg-card/65 backdrop-blur border-border hover:border-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-primary text-white placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-6 font-bold hover:scale-105 transition-all">Search</Button>
          </form>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Latest Movies</h2>
          <div className="w-full md:w-48">
            <Select value={genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genresData?.map((g: any) => (
                  <SelectItem key={g.id} value={g.name}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && page === 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {data?.movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {data?.movies.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500 text-lg">No movies found.</p>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div
              ref={ref}
              className="mt-12 flex items-center justify-center h-20"
            >
              {isFetching && page < (data?.totalPages || 0) && (
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 font-medium">
                    Loading more movies...
                  </span>
                </div>
              )}
              {page >= (data?.totalPages || 0) && data?.movies.length > 0 && (
                <p className="text-zinc-500 font-medium">
                  You've reached the end of the catalog.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
