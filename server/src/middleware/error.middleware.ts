import { Request, Response, NextFunction } from 'express';
import { logger, AppError, ApiError } from '../utils/index.js';
import { env } from '#config/env.js';
import { ErrorResponse } from '#types/index.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Express error handler', {
    error: err.message,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.status,
      message: err.message,
    };

    if (err instanceof ApiError && err.errors) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
}
