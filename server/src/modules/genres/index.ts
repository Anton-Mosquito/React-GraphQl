import axios from 'axios';
import { Genre } from '../movies/entities/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/index.js';
import { TMDBApiError } from '../../utils/index.js';
import { TMDBGenresResponse } from '../../types/index.js';

/**
 * Get list of movie genres from TMDB
 * @param language - Language code (e.g., 'en-US', 'uk-UA')
 * @returns Array of Genre objects
 */
export async function getList(language: string = 'en-US'): Promise<Genre[]> {
  try {
    const response = await axios.get<TMDBGenresResponse>(
      `${config.tmdb.apiBaseUrl}genre/movie/list`,
      {
        params: {
          api_key: config.tmdb.apiKey,
          language,
        },
      }
    );

    logger.debug('Fetched genres list', {
      language,
      count: response.data.genres.length,
    });

    return response.data.genres.map((genre) => new Genre(genre));
  } catch (error) {
    const axiosError = error as any;
    logger.error('Error fetching genres list', {
      language,
      error: axiosError?.message,
      status: axiosError?.response?.status,
    });

    throw new TMDBApiError(
      'Failed to fetch genres list',
      axiosError?.response?.status,
      error
    );
  }
}
