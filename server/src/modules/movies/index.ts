import axios from 'axios';
import { Movies } from './entities/index.js';
import { Movie } from './entities/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/index.js';
import { TMDBApiError } from '../../utils/index.js';
import {
  TMDBMoviesResponse,
  TMDBMovie,
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
  language: string = 'en-US'
): Promise<Movies> {
  try {
    const response = await axios.get<TMDBMoviesResponse>(
      `${config.tmdb.apiBaseUrl}movie/popular`,
      {
        params: {
          api_key: config.tmdb.apiKey,
          language,
          page,
        },
      }
    );

    logger.debug('Fetched popular movies', {
      page,
      language,
      totalResults: response.data.total_results,
    });

    return new Movies(response.data);
  } catch (error) {
    const axiosError = error as any;
    logger.error('Error fetching popular movies', {
      page,
      language,
      error: axiosError?.message,
      status: axiosError?.response?.status,
    });

    throw new TMDBApiError(
      'Failed to fetch popular movies',
      axiosError?.response?.status,
      error
    );
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
  language: string = 'en-US'
): Promise<Movie> {
  try {
    const response = await axios.get<TMDBMovie>(
      `${config.tmdb.apiBaseUrl}movie/${id}`,
      {
        params: {
          api_key: config.tmdb.apiKey,
          language,
        },
      }
    );

    logger.debug('Fetched movie details', { id, language });

    return new Movie(response.data);
  } catch (error) {
    const axiosError = error as any;
    logger.error('Error fetching movie details', {
      id,
      language,
      error: axiosError?.message,
      status: axiosError?.response?.status,
    });

    throw new TMDBApiError(
      `Failed to fetch movie details for ID ${id}`,
      axiosError?.response?.status,
      error
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
  language: string = 'en-US'
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

    const response = await axios.get<TMDBMoviesResponse>(
      `${config.tmdb.apiBaseUrl}discover/movie`,
      {
        params: {
          api_key: config.tmdb.apiKey,
          language,
          page,
          sort_by: `${sortBy}.${sortDirection}`,
          include_adult: includeAdult,
          year,
          primary_release_year: primaryReleaseYear,
          with_genres: genre,
        },
      }
    );

    logger.debug('Discovered movies', {
      filter,
      language,
      totalResults: response.data.total_results,
    });

    return new Movies(response.data);
  } catch (error) {
    const axiosError = error as any;
    logger.error('Error discovering movies', {
      filter,
      language,
      error: axiosError?.message,
      status: axiosError?.response?.status,
    });

    throw new TMDBApiError(
      'Failed to discover movies',
      axiosError?.response?.status,
      error
    );
  }
}
