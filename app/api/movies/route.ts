import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // revalidate every hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''

  const skip = (page - 1) * limit

  try {
    const where = {
      AND: [
        search ? { title: { contains: search, mode: 'insensitive' as const } } : {},
        genre ? { genres: { some: { genre: { name: genre } } } } : {},
      ],
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      }),
      prisma.movie.count({ where }),
    ])

    return NextResponse.json({
      movies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}
