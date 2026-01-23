import tokenService from '../modules/auth/token.service.js';
import type { UserJwtPayload } from '../middleware/auth.middleware.js';

/**
 * Extracts Bearer token from headers, validates it and returns user payload.
 * Returns null when no valid token is present.
 */
export function getUserFromAuthHeader(
  headers: Record<string, any>,
): UserJwtPayload | null {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  const token = parts[1];
  const user = tokenService.validateAccessToken<UserJwtPayload>(token);
  return user || null;
}

export default getUserFromAuthHeader;
