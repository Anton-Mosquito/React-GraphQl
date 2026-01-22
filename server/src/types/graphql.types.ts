import { Request, Response } from 'express';

export interface GraphQLContext {
  locale: string;
  req: Request;
  res: Response;
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
