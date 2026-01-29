/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Genre = {
  __typename?: 'Genre';
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Movie = {
  __typename?: 'Movie';
  adult?: Maybe<Scalars['Boolean']['output']>;
  backdropPath?: Maybe<Scalars['String']['output']>;
  genres?: Maybe<Array<Maybe<Genre>>>;
  id: Scalars['ID']['output'];
  originalLanguage?: Maybe<Scalars['String']['output']>;
  originalTitle?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  posterPath?: Maybe<Scalars['String']['output']>;
  releaseDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
  video?: Maybe<Scalars['Boolean']['output']>;
  voteAverage?: Maybe<Scalars['Float']['output']>;
  voteCount?: Maybe<Scalars['Int']['output']>;
};


export type MovieReleaseDateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type Movies = {
  __typename?: 'Movies';
  page: Scalars['Int']['output'];
  results: Array<Movie>;
  totalPages: Scalars['Int']['output'];
  totalResults: Scalars['Int']['output'];
};

export type MoviesFilterInput = {
  genre?: InputMaybe<Scalars['Int']['input']>;
  includeAdult?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  primaryReleaseYear?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Sort_Direction>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  genres?: Maybe<Array<Maybe<Genre>>>;
  movies?: Maybe<Movies>;
  moviesByIds?: Maybe<Array<Maybe<Movie>>>;
};


export type QueryMoviesArgs = {
  filter?: InputMaybe<MoviesFilterInput>;
};


export type QueryMoviesByIdsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum Sort_Direction {
  Asc = 'asc',
  Desc = 'desc'
}

export type GenresQueryVariables = Exact<{ [key: string]: never; }>;


export type GenresQuery = { __typename?: 'Query', genres?: Array<{ __typename?: 'Genre', id: number, name?: string | null } | null> | null };

export type MoviesQueryVariables = Exact<{
  filter?: InputMaybe<MoviesFilterInput>;
}>;


export type MoviesQuery = { __typename?: 'Query', movies?: { __typename?: 'Movies', page: number, totalResults: number, totalPages: number, results: Array<{ __typename?: 'Movie', id: string, title: string, releaseDate: string, image?: string | null }> } | null };

export type MoviesByIdsQueryVariables = Exact<{
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>> | InputMaybe<Scalars['Int']['input']>>;
}>;


export type MoviesByIdsQuery = { __typename?: 'Query', moviesByIds?: Array<{ __typename?: 'Movie', id: string, title: string, releaseDate: string, image?: string | null } | null> | null };


export const GenresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genres"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GenresQuery, GenresQueryVariables>;
export const MoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Movies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MoviesFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"totalResults"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"posterPath"}},{"kind":"Field","name":{"kind":"Name","value":"releaseDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"format"},"value":{"kind":"StringValue","value":"dd.MM.yyyy","block":false}}]}]}}]}}]}}]} as unknown as DocumentNode<MoviesQuery, MoviesQueryVariables>;
export const MoviesByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoviesByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moviesByIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"posterPath"}},{"kind":"Field","name":{"kind":"Name","value":"releaseDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"format"},"value":{"kind":"StringValue","value":"dd.MM.yyyy","block":false}}]}]}}]}}]} as unknown as DocumentNode<MoviesByIdsQuery, MoviesByIdsQueryVariables>;