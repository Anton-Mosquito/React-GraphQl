import { TokenService } from '#modules/index.js';
import type { TokenPayload } from '#schema/index.js';
import { Request } from 'express';

/**
 * Extracts Bearer token from headers, validates it and returns user payload.
 * Returns null when no valid token is present.
 */
export function getUserFromAuthHeader(
  headers: Record<string, string | string[] | undefined>,
): TokenPayload | null {
  const authHeader = headers['authorization'] || headers['Authorization'];

  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  const token = parts[1];
  if (!token) return null;

  return TokenService.validateAccessToken(token);
}

export default getUserFromAuthHeader;

/**
 * Helper function to extract refresh token from various sources
 */
export function extractRefreshToken(req: Request): string | undefined {
  const cookies = (req as Request & { cookies?: Record<string, string> })
    .cookies;

  return (
    req.body?.refreshToken ||
    cookies?.['refreshToken'] ||
    (typeof req.query?.['refreshToken'] === 'string'
      ? req.query['refreshToken']
      : undefined) ||
    (typeof req.headers['authorization'] === 'string' &&
    req.headers['authorization'].startsWith('Bearer ')
      ? req.headers['authorization'].split(' ')[1]
      : undefined)
  );
}
