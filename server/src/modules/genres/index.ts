import { Genre } from '../movies/entities/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/index.js';
import { TMDBApiError } from '../../utils/index.js';
import { createTMDBClient } from '../../utils/index.js';
import { TMDBGenresResponse } from '../../types/index.js';

/**
 * Get list of movie genres from TMDB
 * @param language - Language code (e.g., 'en-US', 'uk-UA')
 * @returns Array of Genre objects
 */
export async function getList(language: string = 'en-US'): Promise<Genre[]> {
  try {
    const tmdbClient = createTMDBClient(config.tmdb.apiBaseUrl);
    const response = await tmdbClient.get<TMDBGenresResponse>('/genre/movie/list', {
      params: {
        api_key: config.tmdb.apiKey,
        language,
      },
    });

    logger.debug('Fetched genres list', {
      language,
      count: response.data.genres.length,
    });

    return response.data.genres.map((genre) => new Genre(genre));
  } catch (error) {
    logger.error('Error fetching genres list', {
      language,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof TMDBApiError) {
      throw error;
    }

    throw new TMDBApiError('Failed to fetch genres list', undefined, error);
  }
}
