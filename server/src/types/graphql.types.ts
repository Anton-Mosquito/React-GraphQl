import { Request, Response } from 'express';
import type { TokenPayload } from '../modules/auth/token.service.js';
import type { MoviesFilterInput, MovieIdsInput } from './graphql.schemas.js';

export interface GraphQLContext {
  locale: string;
  req: Request;
  res: Response;
  user: TokenPayload | null;
}

// Re-export schemas and types
export type { MoviesFilterInput, MovieIdsInput };
export {
  MoviesFilterInputSchema,
  MovieIdsInputSchema,
} from './graphql.schemas.js';

// Legacy interface for backward compatibility (can be removed later)
export interface MoviesFilterArgs {
  filter?: MoviesFilterInput;
}

export interface MoviesByIdsArgs {
  ids: number[];
}
