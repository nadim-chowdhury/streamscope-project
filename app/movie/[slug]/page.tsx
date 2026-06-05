import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MovieDetailsClient from "./MovieDetailsClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await prisma.movie.findUnique({
    where: { slug },
  });

  if (!movie) {
    return {
      title: "Movie Not Found | StreamScope",
    };
  }

  return {
    title: `${movie.title} (${movie.year}) | StreamScope`,
    description:
      movie.description ||
      `Watch ${movie.title} online in ${movie.quality} quality.`,
    openGraph: {
      title: movie.title,
      description: movie.description || "",
      images: movie.poster ? [movie.poster] : [],
    },
  };
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params;
  return <MovieDetailsClient slug={slug} />;
}
