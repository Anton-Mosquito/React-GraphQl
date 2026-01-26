import { Response, NextFunction } from 'express';
import { TokenService } from '#modules/index.js';
import { ApiError } from '#utils/index.js';
import type { AuthRequest } from '#types/index.js';

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    next(ApiError.Unauthorized('No authorization header'));
    return;
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    next(ApiError.Unauthorized('Malformed authorization header'));
    return;
  }

  const token = parts[1];
  if (!token) {
    next(ApiError.Unauthorized('No token provided'));
    return;
  }

  const userData = TokenService.validateAccessToken(token);
  if (!userData) {
    next(ApiError.Unauthorized('Invalid or expired token'));
    return;
  }

  req.user = userData;
  next();
}
