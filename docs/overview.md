# Project Overview

Build a **Movie Aggregator & Indexing Platform**.

The system:

```text
External Movie Website
          ↓
      Scraper
          ↓
    PostgreSQL
          ↓
     Next.js App
          ↓
 Users Browse Movies
```

Instead of scraping on every request:

```text
User
 ↓
Your Database
```

This is much faster.

---

# Tech Stack

```text
Next.js 15
TypeScript
PostgreSQL
Prisma
Redux Toolkit
RTK Query
Shadcn UI
Playwright
Cron Jobs
Zod
```

---

# Architecture

```text
src/
│
├── app/
│
├── components/
│
├── features/
│   ├── movies
│   ├── genres
│   ├── search
│
├── lib/
│   ├── scraper
│   ├── prisma
│
├── services/
│   ├── moviesApi
│
├── actions/
│
├── db/
│
└── prisma/
```

---

# Database Design

### Movie

```prisma
model Movie {
  id            String   @id @default(cuid())

  title         String
  slug          String   @unique

  poster        String?

  description   String?

  year          Int?

  imdbRating    Float?

  quality       String?

  sourceUrl     String

  createdAt     DateTime @default(now())

  updatedAt     DateTime @updatedAt

  genres        MovieGenre[]
  servers       WatchServer[]
}
```

---

### Genre

```prisma
model Genre {
  id      String @id @default(cuid())

  name    String @unique

  movies  MovieGenre[]
}
```

---

### Watch Server

```prisma
model WatchServer {
  id        String @id @default(cuid())

  name      String

  url       String

  movieId   String

  movie     Movie @relation(fields:[movieId], references:[id])
}
```

---

# Scraping System

Create:

```text
src/lib/scraper
```

### scraper.ts

```ts
export async function scrapeMovies() {}
```

---

# Option 1 (Simple Sites)

Use:

```bash
npm i axios cheerio
```

Workflow:

```text
Get HTML
 ↓
Load Cheerio
 ↓
Extract Cards
 ↓
Save Database
```

---

# Option 2 (Protected Sites)

Use:

```bash
npm i playwright
```

Workflow:

```text
Launch Browser
 ↓
Wait For JS
 ↓
Extract Data
 ↓
Save Database
```

---

# Scheduler

Run automatically.

### Daily Update

```text
Every 6 hours
```

Using:

```bash
npm i node-cron
```

Example:

```ts
cron.schedule("0 */6 * * *", async () => {
  await scrapeMovies();
});
```

---

# Search System

Database search.

Example:

```sql
Avengers
Batman
John Wick
```

Use PostgreSQL Full Text Search.

Fast even with:

```text
100,000+ movies
```

---

# RTK Query Structure

```text
features/
 └── api
     └── moviesApi.ts
```

Example:

```ts
getMovies;
getMovie;
getGenres;
searchMovies;
```

---

# Homepage

```text
Hero
Trending
Latest Movies
Popular Movies
Top Rated
Genres
```

---

# Movie Details Page

```text
Poster
Title
Description
Year
Genres
IMDB
Watch Servers
Download Links
Related Movies
```

---

# Admin Area

Even without a separate backend:

```text
/app/admin
```

Features:

- Trigger scraper
- Re-index movies
- Delete broken records
- View scrape logs

Protected with:

```text
NextAuth
Role-based middleware
```

---

# Advanced Features

### Similar Movies

Use PostgreSQL similarity:

```text
Genre
Year
Rating
```

---

### Auto Slug Generation

```text
john-wick-4
oppenheimer
interstellar
```

---

### SEO

Generate:

```text
/movie/interstellar
/movie/john-wick-4
```

Metadata:

```ts
generateMetadata();
```

---

### Infinite Scroll

RTK Query + Server Actions.

---

### Caching

Use:

```text
Next.js Cache
Revalidation
```

Example:

```ts
revalidate = 3600;
```

---

# Development Phases

### Phase 1

- Setup Next.js
- Setup Prisma
- Setup PostgreSQL
- Setup Shadcn UI

### Phase 2

- Create database schema
- Build scraper
- Store movies

### Phase 3

- Homepage
- Search
- Pagination
- Movie details

### Phase 4

- RTK Query
- Admin dashboard
- Auto updates

### Phase 5

- SEO
- Analytics
- Performance optimization

---

### Portfolio-Level Title

**StreamScope — Automated Movie Discovery & Aggregation Platform**

A full-stack Next.js application that automatically indexes movie metadata from external sources, stores it in PostgreSQL, provides fast search and filtering, scheduled updates, SEO-optimized pages, and a modern streaming-platform UI built with Shadcn UI, Redux Toolkit, and RTK Query.
