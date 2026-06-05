import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: true,
      },
    })

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }

    const genreIds = movie.genres.map((g) => g.genreId)

    const similarMovies = await prisma.movie.findMany({
      where: {
        slug: { not: slug },
        genres: {
          some: {
            genreId: { in: genreIds },
          },
        },
      },
      take: 6,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        imdbRating: 'desc',
      },
    })

    return NextResponse.json(similarMovies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch similar movies' }, { status: 500 })
  }
}
