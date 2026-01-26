import { Request, Response } from 'express';
import type { TokenPayload, MoviesFilterInput } from '#schema/index.js';

export interface GraphQLContext {
  locale: string;
  req: Request;
  res: Response;
  user: TokenPayload | null;
}

export interface MoviesFilterArgs {
  filter?: MoviesFilterInput;
}

export interface MoviesByIdsArgs {
  ids: number[];
}
