import { z } from 'zod';

/**
 * Zod schema for TMDB Genre
 */
export const TMDBGenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
});

/**
 * Zod schema for TMDB Movie
 * Validates all required and optional fields from TMDB API
 */
export const TMDBMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  original_title: z.string().min(1),
  release_date: z.string(), // Format: "YYYY-MM-DD" or empty string
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  adult: z.boolean(),
  overview: z.string(),
  original_language: z.string().min(1),
  popularity: z.number().nonnegative(),
  vote_count: z.number().int().nonnegative(),
  video: z.boolean(),
  vote_average: z.number().nonnegative(),
  genre_ids: z.array(z.number().int().positive()).optional(),
  genres: z.array(TMDBGenreSchema).optional(),
});

/**
 * Zod schema for paginated TMDB Movies Response
 */
export const TMDBMoviesResponseSchema = z.object({
  page: z.number().int().positive(),
  total_results: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
  results: z.array(TMDBMovieSchema),
});

/**
 * Zod schema for TMDB Genres List Response
 */
export const TMDBGenresResponseSchema = z.object({
  genres: z.array(TMDBGenreSchema),
});

// Export inferred TypeScript types
export type TMDBGenre = z.infer<typeof TMDBGenreSchema>;
export type TMDBMovie = z.infer<typeof TMDBMovieSchema>;
export type TMDBMoviesResponse = z.infer<typeof TMDBMoviesResponseSchema>;
export type TMDBGenresResponse = z.infer<typeof TMDBGenresResponseSchema>;

// Re-export schemas for use in validation
export {
  TMDBGenreSchema as GenreSchema,
  TMDBMovieSchema as MovieSchema,
  TMDBMoviesResponseSchema as MoviesResponseSchema,
  TMDBGenresResponseSchema as GenresResponseSchema,
};
