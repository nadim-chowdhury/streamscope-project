import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminDashboardClient from "./AdminDashboardClient"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-zinc-500 mt-2">Please sign in to access the admin dashboard.</p>
      </div>
    )
  }

  const [movieCount, genreCount] = await Promise.all([
    prisma.movie.count().catch(() => 0),
    prisma.genre.count().catch(() => 0)
  ])

  return (
    <AdminDashboardClient 
      session={session} 
      initialMovieCount={movieCount} 
      initialGenreCount={genreCount} 
    />
  )
}
