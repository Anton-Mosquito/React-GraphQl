import { Request, Response, NextFunction } from 'express';
import {
  ActivationService,
  UsersService,
  SessionService,
  AuthService,
} from '#modules/index.js';
import { extractRefreshToken, ApiError } from '#utils/index.js';

class AuthController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const data = await AuthService.register(req.body);
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
      const data = await AuthService.login(req.body);
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

      await AuthService.logout(refreshToken);
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

      const result = await ActivationService.activate(link);

      return res.json(result);
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

      const data = await SessionService.refresh(refreshToken);
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
      const users = await UsersService.getAllUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const user = await UsersService.getUserById(req.params['id']);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
