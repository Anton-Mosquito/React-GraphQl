/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Genres {\n    genres {\n      id\n      name\n    }\n  }\n": typeof types.GenresDocument,
    "\n  query Movies($filter: MoviesFilterInput) {\n    movies(filter: $filter) {\n      page\n      totalResults\n      totalPages\n      results {\n        id\n        title\n        image: posterPath\n        releaseDate(format: \"dd.MM.yyyy\")\n      }\n    }\n  }\n": typeof types.MoviesDocument,
    "\n  query MoviesByIds($ids: [Int]) {\n    moviesByIds(ids: $ids) {\n      id\n      title\n      image: posterPath\n      releaseDate(format: \"dd.MM.yyyy\")\n    }\n  }\n": typeof types.MoviesByIdsDocument,
};
const documents: Documents = {
    "\n  query Genres {\n    genres {\n      id\n      name\n    }\n  }\n": types.GenresDocument,
    "\n  query Movies($filter: MoviesFilterInput) {\n    movies(filter: $filter) {\n      page\n      totalResults\n      totalPages\n      results {\n        id\n        title\n        image: posterPath\n        releaseDate(format: \"dd.MM.yyyy\")\n      }\n    }\n  }\n": types.MoviesDocument,
    "\n  query MoviesByIds($ids: [Int]) {\n    moviesByIds(ids: $ids) {\n      id\n      title\n      image: posterPath\n      releaseDate(format: \"dd.MM.yyyy\")\n    }\n  }\n": types.MoviesByIdsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Genres {\n    genres {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query Genres {\n    genres {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Movies($filter: MoviesFilterInput) {\n    movies(filter: $filter) {\n      page\n      totalResults\n      totalPages\n      results {\n        id\n        title\n        image: posterPath\n        releaseDate(format: \"dd.MM.yyyy\")\n      }\n    }\n  }\n"): (typeof documents)["\n  query Movies($filter: MoviesFilterInput) {\n    movies(filter: $filter) {\n      page\n      totalResults\n      totalPages\n      results {\n        id\n        title\n        image: posterPath\n        releaseDate(format: \"dd.MM.yyyy\")\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MoviesByIds($ids: [Int]) {\n    moviesByIds(ids: $ids) {\n      id\n      title\n      image: posterPath\n      releaseDate(format: \"dd.MM.yyyy\")\n    }\n  }\n"): (typeof documents)["\n  query MoviesByIds($ids: [Int]) {\n    moviesByIds(ids: $ids) {\n      id\n      title\n      image: posterPath\n      releaseDate(format: \"dd.MM.yyyy\")\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;