import { z } from 'zod';

const positiveInt = z.number().int().positive();
const nonNegativeInt = z.number().int().nonnegative();
const nonNegativeNumber = z.number().nonnegative();
const nonEmptyString = z.string().min(1);
const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .or(z.literal(''));

export const tmdbGenreSchema = z
  .object({
    id: positiveInt,
    name: nonEmptyString,
  })
  .strict();

export const tmdbMovieSchema = z
  .object({
    id: positiveInt,
    title: nonEmptyString,
    original_title: nonEmptyString,
    release_date: isoDateString,
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
    adult: z.boolean(),
    overview: z.string(),
    original_language: nonEmptyString,
    popularity: nonNegativeNumber,
    vote_count: nonNegativeInt,
    video: z.boolean(),
    vote_average: nonNegativeNumber,
    genre_ids: z.array(positiveInt).optional(),
    genres: z.array(tmdbGenreSchema).optional(),
  })
  .strict();

export const tmdbMoviesResponseSchema = z
  .object({
    page: positiveInt,
    total_results: nonNegativeInt,
    total_pages: nonNegativeInt,
    results: z.array(tmdbMovieSchema),
  })
  .strict();

export const tmdbGenresResponseSchema = z
  .object({
    genres: z.array(tmdbGenreSchema),
  })
  .strict();

export type TMDBGenre = z.infer<typeof tmdbGenreSchema>;
export type TMDBMovie = z.infer<typeof tmdbMovieSchema>;
export type TMDBMoviesResponse = z.infer<typeof tmdbMoviesResponseSchema>;
export type TMDBGenresResponse = z.infer<typeof tmdbGenresResponseSchema>;
