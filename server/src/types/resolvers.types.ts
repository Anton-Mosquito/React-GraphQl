import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from './graphql.types.js';
import { Movie } from '../modules/movies/entities/index.js';
import { Movies } from '../modules/movies/entities/index.js';
import { Genre } from '../modules/movies/entities/index.js';

// Parent types for resolvers
export type MovieParent = Movie;
export type MoviesParent = Movies;

// Resolver type definitions
export type QueryResolvers = {
  movies: (
    parent: unknown,
    args: { filter?: any },
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => Promise<Movies>;

  moviesByIds: (
    parent: unknown,
    args: { ids: number[] },
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => Promise<Movie[]>;

  genres: (
    parent: unknown,
    args: Record<string, never>,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => Promise<Genre[]>;
};

// Field resolver for Movie.releaseDate
export type MovieFieldResolvers = {
  releaseDate: (
    parent: MovieParent,
    args: { format?: string },
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) => string;
};

// Complete resolvers structure
export interface Resolvers {
  Query: QueryResolvers;
  Movie?: MovieFieldResolvers;
}
