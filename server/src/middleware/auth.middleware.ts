import { Request, Response, NextFunction } from 'express';
import tokenService from '../modules/auth/token.service.js';
import { ApiError } from '../utils/errors.js';

export interface UserJwtPayload {
  id: string;
  email?: string;
  isActivated?: boolean;
}

export interface AuthRequest extends Request {
  user?: UserJwtPayload;
}

export default function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next(ApiError.Unauthorized('No authorization header'));
  }

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(ApiError.Unauthorized('Malformed authorization header'));
  }

  const token = parts[1];
  const userData = tokenService.validateAccessToken<UserJwtPayload>(token);
  if (!userData) {
    return next(ApiError.Unauthorized('Invalid or expired token'));
  }

  req.user = userData;
  next();
}
