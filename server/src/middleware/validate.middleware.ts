import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ApiError } from '#utils/index.js';

export function validateMiddleware<T extends ZodType<unknown, unknown>>(
  schema: T,
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);

      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(ApiError.BadRequest('Validation error', err.issues));
      }
      return next(err);
    }
  };
}
