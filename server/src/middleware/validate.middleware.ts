import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ApiError } from '../utils/errors.js';

export default function validateMiddleware<T extends ZodType<any, any>>(
  schema: T,
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      // replace body with the parsed/validated value
      req.body = parsed as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(ApiError.BadRequest('Validation error', err.issues));
      }
      return next(err);
    }
  };
}
