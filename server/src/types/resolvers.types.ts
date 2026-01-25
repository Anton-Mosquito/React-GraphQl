import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from './graphql.types.js';
import { Movie, Movies, Genre } from '#modules/index.js';
import { MoviesFilterInput } from '#schema/index.js';

export type MovieParent = Movie;
export type MoviesParent = Movies;

// Resolver type definitions
export type QueryResolvers = {
  movies: (
    parent: unknown,
    args: { filter?: MoviesFilterInput },
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
