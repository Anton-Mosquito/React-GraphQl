import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/index.js';

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

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
}
