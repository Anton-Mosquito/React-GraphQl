import { z } from 'zod';

/**
 * Zod schema for Movies filter input (GraphQL)
 * Validates all filter parameters with proper constraints
 */
export const MoviesFilterInputSchema = z
  .object({
    page: z.number().int().min(1).max(500).optional(),
    sortBy: z
      .enum([
        'popularity',
        'release_date',
        'revenue',
        'primary_release_date',
        'original_title',
        'vote_average',
        'vote_count',
      ])
      .optional(),
    sortDirection: z.enum(['desc', 'asc']).optional(),
    includeAdult: z.boolean().optional(),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 5)
      .optional(),
    primaryReleaseYear: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 5)
      .optional(),
    genre: z.number().int().positive().optional(),
  })
  .optional();

/**
 * Zod schema for movie IDs array
 */
export const MovieIdsInputSchema = z
  .array(z.number().int().positive())
  .min(1, 'At least one movie ID is required')
  .max(50, 'Cannot request more than 50 movies at once');

// Export inferred types
export type MoviesFilterInput = z.infer<typeof MoviesFilterInputSchema>;
export type MovieIdsInput = z.infer<typeof MovieIdsInputSchema>;
