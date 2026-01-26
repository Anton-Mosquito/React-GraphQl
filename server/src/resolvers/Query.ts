import { moviesService } from '#modules/index.js';
import { QueryResolvers } from '#types/index.js';
import { logger } from '#utils/index.js';
import { GraphQLError } from 'graphql';

const queryResolvers: QueryResolvers = {
  /**
   * GraphQL Query: movies
   * Get movies with optional filters
   */
  async movies(_parent, args, context) {
    try {
      logger.debug('Query.movies called', {
        hasFilter: !!args.filter,
        locale: context.locale,
      });

      return await moviesService.getMovies(args.filter, context.locale);
    } catch (error) {
      logger.error('Error in movies resolver', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filter: args.filter,
      });

      if (error instanceof Error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'MOVIES_FETCH_ERROR',
            originalError: error,
          },
        });
      }

      throw error;
    }
  },

  /**
   * GraphQL Query: moviesByIds
   * Get multiple movies by their IDs
   */
  async moviesByIds(_parent, { ids }, context) {
    try {
      logger.debug('Query.moviesByIds called', {
        count: ids?.length ?? 0,
        locale: context.locale,
      });

      return await moviesService.getMoviesByIds(ids, context.locale);
    } catch (error) {
      logger.error('Error in moviesByIds resolver', {
        error: error instanceof Error ? error.message : 'Unknown error',
        idsCount: ids?.length ?? 0,
      });

      if (error instanceof Error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'MOVIES_BY_IDS_FETCH_ERROR',
            originalError: error,
          },
        });
      }

      throw error;
    }
  },

  /**
   * GraphQL Query: genres
   * Get list of all movie genres
   */
  async genres(_parent, _args, context) {
    try {
      logger.debug('Query.genres called', { locale: context.locale });

      return await moviesService.getGenres(context.locale);
    } catch (error) {
      logger.error('Error in genres resolver', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'GENRES_FETCH_ERROR',
            originalError: error,
          },
        });
      }

      throw error;
    }
  },
};

export default queryResolvers;
