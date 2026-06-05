import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getMovies: builder.query<any, { page?: number; limit?: number; search?: string; genre?: string }>({
      query: (params) => ({
        url: '/movies',
        params,
      }),
      // Only re-fetch when search or genre changes, otherwise append to existing cache
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { search, genre } = queryArgs
        return `${endpointName}-${search || ''}-${genre || ''}`
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems
        }
        return {
          ...newItems,
          movies: [...currentCache.movies, ...newItems.movies],
        }
      },
      // Refetch when the args change (except for page)
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.search !== previousArg?.search || currentArg?.genre !== previousArg?.genre
      },
    }),
    getMovieBySlug: builder.query<any, string>({
      query: (slug) => `/movies/${slug}`,
    }),
    getSimilarMovies: builder.query<any, string>({
      query: (slug) => `/movies/${slug}/similar`,
    }),
    getGenres: builder.query<any, void>({
      query: () => '/genres',
    }),
  }),
})

export const { useGetMoviesQuery, useGetMovieBySlugQuery, useGetSimilarMoviesQuery, useGetGenresQuery } = moviesApi
