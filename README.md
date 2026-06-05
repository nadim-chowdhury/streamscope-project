# StreamScope — Automated Movie Discovery & Aggregation Platform

StreamScope is a high-performance, full-stack Next.js application designed to automatically index movie metadata from various external sources and provide users with a seamless browsing and discovery experience.

## 🚀 Key Features

- **Automated Scraping**: Multi-mode scraper supporting both simple (Cheerio) and dynamic/protected (Playwright) websites.
- **Smart Scheduling**: Background updates triggered every 6 hours via Next.js `instrumentation`.
- **Modern User Experience**:
    - **Infinite Scroll**: Seamless catalog browsing using RTK Query cache merging.
    - **Advanced Search**: Real-time search with PostgreSQL Full Text Search capabilities.
    - **Genre Filtering**: Easy navigation across different movie categories.
    - **Cinematic Detail Pages**: Rich metadata, backdrops, and multiple watch servers.
- **Secure Administration**:
    - **Protected Dashboard**: Secured with NextAuth.js (v5) and Middleware.
    - **Manual Controls**: Trigger scrapers and monitor system health from a dedicated UI.
- **SEO & Performance**:
    - **Dynamic Metadata**: SEO-optimized pages with OpenGraph support for better social sharing.
    - **API Caching**: Edge-ready caching with automatic revalidation.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma 7 (Full Text Search enabled)
- **State Management**: Redux Toolkit & RTK Query
- **Scraping**: Cheerio, Playwright, Axios, Zod
- **Authentication**: NextAuth.js (v5)
- **Styling**: Tailwind CSS, Shadcn UI
- **Automation**: node-cron

## 📂 Architecture

- `app/`: Next.js App Router (Routes, API, Pages)
- `components/`: Reusable UI components and platform-specific logic.
- `features/api/`: RTK Query service definitions.
- `lib/`: Core utilities (Prisma, Scraper, Auth, Scheduler).
- `prisma/`: Database schema and migrations.

## 🏁 Getting Started

1. **Clone & Install**: `npm install`
2. **Environment**: Copy `.env.example` to `.env` and configure your credentials.
3. **Database Setup**: `npx prisma db push`
4. **Run Development**: `npm run dev`

---
*Built with precision and performance by Gemini CLI.*
