import { z } from 'zod';
import {
  CURRENT_YEAR,
  MIN_YEAR,
  MAX_FUTURE_YEARS,
} from '../constants/index.js';

const positiveInt = z.number().int().positive();
const yearSchema = z
  .number()
  .int()
  .min(MIN_YEAR)
  .max(CURRENT_YEAR + MAX_FUTURE_YEARS);

export const MovieSortBy = z.enum([
  'popularity',
  'release_date',
  'revenue',
  'primary_release_date',
  'original_title',
  'vote_average',
  'vote_count',
]);

export const SortDirection = z.enum(['desc', 'asc']);

export const moviesFilterInputSchema = z
  .object({
    page: z.number().int().min(1).max(500).optional(),
    sortBy: MovieSortBy.optional(),
    sortDirection: SortDirection.optional(),
    includeAdult: z.boolean().optional(),
    year: yearSchema.optional(),
    primaryReleaseYear: yearSchema.optional(),
    genre: positiveInt.optional(),
  })
  .strict()
  .optional();

export const movieIdsInputSchema = z
  .array(positiveInt)
  .min(1, 'At least one movie ID is required')
  .max(50, 'Cannot request more than 50 movies at once');

export type MoviesFilterInput = z.infer<typeof moviesFilterInputSchema>;
export type MovieIdsInput = z.infer<typeof movieIdsInputSchema>;
export type MovieSortByType = z.infer<typeof MovieSortBy>;
export type SortDirectionType = z.infer<typeof SortDirection>;
