import { moviesFilterInputSchema, movieIdsInputSchema } from '#schema/index.js';
import { logger } from '#utils/logger.js';
import {
  Movies,
  Movie,
  Genre,
  getList,
  discoverMovie,
  getDetails,
  getPopular,
} from '#modules/index.js';

class MoviesService {
  /**
   * Get movies with optional filters
   * Validates filter input and delegates to TMDB API
   */
  async getMovies(filter: unknown, locale: string = 'en-US'): Promise<Movies> {
    const validatedFilter = moviesFilterInputSchema.parse(filter ?? {});

    logger.debug('MoviesService.getMovies', {
      filter: validatedFilter,
      locale,
    });

    return discoverMovie(validatedFilter ?? {}, locale);
  }

  /**
   * Get multiple movies by their IDs
   * Validates IDs array and fetches movies in parallel
   */
  async getMoviesByIds(
    ids: unknown,
    locale: string = 'en-US',
  ): Promise<Movie[]> {
    const validatedIds = movieIdsInputSchema.parse(ids);

    logger.debug('MoviesService.getMoviesByIds', {
      count: validatedIds.length,
      locale,
    });

    const moviePromises = validatedIds.map((id: number) =>
      getDetails(id, locale),
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

    return getList(locale);
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

    return getPopular(page, locale);
  }
}

export default new MoviesService();
