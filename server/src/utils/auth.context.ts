import tokenService, { TokenPayload } from '../modules/auth/token.service.js';

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

  return tokenService.validateAccessToken(token);
}

export default getUserFromAuthHeader;
