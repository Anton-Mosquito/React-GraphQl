import { Request, Response, NextFunction } from 'express';
import tokenService, { TokenPayload } from '../modules/auth/token.service.js';
import { ApiError } from '../utils/errors.js';

// Re-export TokenPayload for other modules
export type { TokenPayload };

// Extend Express Request with user property
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export default function authMiddleware(
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

  const userData = tokenService.validateAccessToken(token);
  if (!userData) {
    next(ApiError.Unauthorized('Invalid or expired token'));
    return;
  }

  req.user = userData;
  next();
}
