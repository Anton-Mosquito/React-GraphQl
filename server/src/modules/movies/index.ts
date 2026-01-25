import { Movies } from './entities/index.js';
import { Movie } from './entities/index.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/index.js';
import { TMDBApiError } from '../../utils/index.js';
import { createTMDBClient } from '../../utils/index.js';
import {
  TMDBMoviesResponseSchema,
  TMDBMovieSchema,
  MovieFilterInput,
} from '../../types/index.js';

/**
 * Get popular movies from TMDB
 * @param page - Page number for pagination
 * @param language - Language code (e.g., 'en-US', 'uk-UA')
 * @returns Movies object with pagination data
 */
export async function getPopular(
  page: number = 1,
  language: string = 'en-US',
): Promise<Movies> {
  try {
    const tmdbClient = createTMDBClient(env.TMDB_API_BASE_URL);
    const response = await tmdbClient.getValidated(
      '/movie/popular',
      TMDBMoviesResponseSchema,
      {
        params: {
          api_key: env.TMDB_API_KEY,
          language,
          page,
        },
      },
    );

    logger.debug('Fetched popular movies', {
      page,
      language,
      totalResults: response.data.total_results,
    });

    return new Movies(response.data);
  } catch (error) {
    logger.error('Error fetching popular movies', {
      page,
      language,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof TMDBApiError) {
      throw error;
    }

    throw new TMDBApiError('Failed to fetch popular movies', undefined, error);
  }
}

/**
 * Get movie details by ID from TMDB
 * @param id - Movie ID
 * @param language - Language code (e.g., 'en-US', 'uk-UA')
 * @returns Movie details
 */
export async function getDetails(
  id: number,
  language: string = 'en-US',
): Promise<Movie> {
  try {
    const tmdbClient = createTMDBClient(env.TMDB_API_BASE_URL);
    const response = await tmdbClient.getValidated(
      `/movie/${id}`,
      TMDBMovieSchema,
      {
        params: {
          api_key: env.TMDB_API_KEY,
          language,
        },
      },
    );

    logger.debug('Fetched movie details', { id, language });

    return new Movie(response.data);
  } catch (error) {
    logger.error('Error fetching movie details', {
      id,
      language,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof TMDBApiError) {
      throw error;
    }

    throw new TMDBApiError(
      `Failed to fetch movie details for ID ${id}`,
      undefined,
      error,
    );
  }
}

/**
 * Discover movies with filters
 * @param filter - Filter options (page, sortBy, year, genre, etc.)
 * @param language - Language code (e.g., 'en-US', 'uk-UA')
 * @returns Movies object with pagination data
 */
export async function discoverMovie(
  filter: MovieFilterInput = {},
  language: string = 'en-US',
): Promise<Movies> {
  try {
    const {
      page = 1,
      sortBy = 'popularity',
      sortDirection = 'desc',
      includeAdult = false,
      year,
      primaryReleaseYear,
      genre,
    } = filter;

    const tmdbClient = createTMDBClient(env.TMDB_API_BASE_URL);
    const response = await tmdbClient.getValidated(
      '/discover/movie',
      TMDBMoviesResponseSchema,
      {
        params: {
          api_key: env.TMDB_API_KEY,
          language,
          page,
          sort_by: `${sortBy}.${sortDirection}`,
          include_adult: includeAdult,
          year,
          primary_release_year: primaryReleaseYear,
          with_genres: genre,
        },
      },
    );

    logger.debug('Discovered movies', {
      filter,
      language,
      totalResults: response.data.total_results,
    });

    return new Movies(response.data);
  } catch (error) {
    logger.error('Error discovering movies', {
      filter,
      language,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof TMDBApiError) {
      throw error;
    }

    throw new TMDBApiError('Failed to discover movies', undefined, error);
  }
}
