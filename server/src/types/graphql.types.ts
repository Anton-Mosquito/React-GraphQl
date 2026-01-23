import { Request, Response } from 'express';
import type { UserJwtPayload } from '../middleware/auth.middleware.js';

export interface GraphQLContext {
  locale: string;
  req: Request;
  res: Response;
  user?: UserJwtPayload | null;
}

export interface MoviesFilterArgs {
  filter?: {
    page?: number;
    sortBy?: string;
    sortDirection?: 'desc' | 'asc';
    includeAdult?: boolean;
    year?: number;
    primaryReleaseYear?: number;
    genre?: number;
  };
}

export interface MoviesByIdsArgs {
  ids: number[];
}
