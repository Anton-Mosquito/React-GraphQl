import * as moviesApi from './index.js';
import { getList as getGenresList } from '../genres/index.js';
import {
  MoviesFilterInputSchema,
  MovieIdsInputSchema,
} from '../../types/graphql.schemas.js';
import { logger } from '../../utils/logger.js';
import { Movies, Movie, Genre } from './entities/index.js';

class MoviesService {
  /**
   * Get movies with optional filters
   * Validates filter input and delegates to TMDB API
   */
  async getMovies(filter: unknown, locale: string = 'en-US'): Promise<Movies> {
    // Validate and parse filter input
    const validatedFilter = MoviesFilterInputSchema.parse(filter ?? {});

    logger.debug('MoviesService.getMovies', {
      filter: validatedFilter,
      locale,
    });

    // Delegate to TMDB API
    return moviesApi.discoverMovie(validatedFilter ?? {}, locale);
  }

  /**
   * Get multiple movies by their IDs
   * Validates IDs array and fetches movies in parallel
   */
  async getMoviesByIds(
    ids: unknown,
    locale: string = 'en-US',
  ): Promise<Movie[]> {
    // Validate IDs input
    const validatedIds = MovieIdsInputSchema.parse(ids);

    logger.debug('MoviesService.getMoviesByIds', {
      count: validatedIds.length,
      locale,
    });

    // Fetch all movies in parallel
    const moviePromises = validatedIds.map((id) =>
      moviesApi.getDetails(id, locale),
    );

    const movies = await Promise.all(moviePromises);

    logger.debug('MoviesService.getMoviesByIds - completed', {
      fetched: movies.length,
    });

    return movies;
  }

  /**
   * Get list of all movie genres
   */
  async getGenres(locale: string = 'en-US'): Promise<Genre[]> {
    logger.debug('MoviesService.getGenres', { locale });

    return getGenresList(locale);
  }

  /**
   * Get popular movies (helper method)
   * Can be exposed as separate GraphQL query if needed
   */
  async getPopularMovies(
    page: number = 1,
    locale: string = 'en-US',
  ): Promise<Movies> {
    logger.debug('MoviesService.getPopularMovies', { page, locale });

    return moviesApi.getPopular(page, locale);
  }
}

export default new MoviesService();
