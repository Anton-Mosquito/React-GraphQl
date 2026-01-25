// Re-export types and schemas from tmdb.schemas.ts
export type {
  TMDBGenre,
  TMDBMovie,
  TMDBMoviesResponse,
  TMDBGenresResponse,
} from './tmdb.schemas.js';

export {
  TMDBGenreSchema,
  TMDBMovieSchema,
  TMDBMoviesResponseSchema,
  TMDBGenresResponseSchema,
} from './tmdb.schemas.js';

// GraphQL input types (these stay here as they're not from TMDB)
export interface MovieFilterInput {
  page?: number;
  sortBy?: string;
  sortDirection?: 'desc' | 'asc';
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
  genre?: number;
}
