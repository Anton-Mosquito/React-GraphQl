import {
  getDetails,
  discoverMovie,
} from '../modules/movies/index.js';
import { getList } from '../modules/genres/index.js';
import { QueryResolvers } from '../types/index.js';
import { logger } from '../utils/index.js';
import { validateMovieFilter, validateMovieIds } from '../utils/index.js';

const queryResolvers: QueryResolvers = {
  async movies(_parent, args, context) {
    try {
      // Validate input
      validateMovieFilter(args.filter);

      logger.debug('Query: movies', { filter: args.filter, locale: context.locale });
      const data = await discoverMovie(args.filter, context.locale);
      return data;
    } catch (error) {
      logger.error('Error in movies resolver', { error, filter: args.filter });
      throw error;
    }
  },

  async moviesByIds(_parent, { ids }, context) {
    try {
      // Validate input
      validateMovieIds(ids);

      logger.debug('Query: moviesByIds', { ids, locale: context.locale });
      const requests = ids.map((id) => getDetails(id, context.locale));
      const movies = await Promise.all(requests);
      return movies;
    } catch (error) {
      logger.error('Error in moviesByIds resolver', { error, ids });
      throw error;
    }
  },

  async genres(_parent, _args, context) {
    try {
      logger.debug('Query: genres', { locale: context.locale });
      return await getList(context.locale);
    } catch (error) {
      logger.error('Error in genres resolver', { error });
      throw error;
    }
  },
};

export default queryResolvers;
