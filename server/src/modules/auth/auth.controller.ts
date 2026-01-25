import { Request, Response, NextFunction } from 'express';
import authService from './auth.service.js';
import sessionService from './session.service.js';
import activationService from './activation.service.js';
import usersService from '../users/users.service.js';
import { ApiError } from '../../utils/errors.js';

/**
 * Helper function to extract refresh token from various sources
 */
function extractRefreshToken(req: Request): string | undefined {
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

class AuthController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data = await authService.register(req.body);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data = await authService.login(req.body);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const refreshToken = extractRefreshToken(req);

      if (!refreshToken) {
        return res.json({ message: 'No refresh token provided' });
      }

      await authService.logout(refreshToken);
      return res.json({ message: 'Logged out successfully' });
    } catch (err) {
      return next(err);
    }
  }

  async activate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const link = Array.isArray(req.params['link'])
        ? req.params['link'][0]
        : req.params['link'];
      if (!link) {
        return next(ApiError.BadRequest('Activation link is required'));
      }

      await activationService.activate(link);

      // Redirect to client after successful activation
      const clientUrl = process.env['CLIENT_URL'] || 'http://localhost:3000';
      return res.redirect(clientUrl);
    } catch (err) {
      return next(err);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const refreshToken = extractRefreshToken(req);

      if (!refreshToken) {
        return next(ApiError.Unauthorized('No refresh token provided'));
      }

      const data = await sessionService.refresh(refreshToken);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const users = await usersService.getAllUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
