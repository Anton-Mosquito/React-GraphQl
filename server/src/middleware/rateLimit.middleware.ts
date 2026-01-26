import rateLimit, { type Options } from 'express-rate-limit';
import type { Request, Response } from 'express';
import { logger } from '#utils/index.js';

function createHandler(message: string) {
  return (req: Request, res: Response) => {
    logger.warn(message, {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(429).json({
      error: 'Too many requests',
      message: `${message} - Too many requests from this IP, please try again later.`,
    });
  };
}

function buildLimiter(opts: Partial<Options>) {
  const defaults: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createHandler('Rate limit exceeded'),
  };

  return rateLimit({ ...defaults, ...opts } as Options);
}

/**
 * Standard API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: createHandler('Rate limit exceeded'),
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: createHandler('Auth rate limit exceeded'),
});

/**
 * GraphQL rate limiter
 * 200 requests per 15 minutes per IP
 */
export const graphqlLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 200,
  handler: createHandler('GraphQL rate limit exceeded'),
});

/**
 * Activation link rate limiter
 * 10 requests per hour per IP
 */
export const activationLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  handler: createHandler('Activation rate limit exceeded'),
});
