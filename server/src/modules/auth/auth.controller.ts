import { Request, Response, NextFunction } from 'express';
import usersService from '../users/users.service.js';

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const data = await usersService.registration(email, password);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const data = await usersService.login(email, password);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.body?.refreshToken || (req as any).cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(200).json({ message: 'No refresh token provided' });
      }
      await usersService.logout(refreshToken);
      return res.json({ message: 'Logged out' });
    } catch (err) {
      return next(err);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { link } = req.params;
      const linkStr = Array.isArray(link) ? link[0] : link;
      await usersService.activate(linkStr);
      // redirect to client activation page
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      return res.redirect(clientUrl);
    } catch (err) {
      return next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        (req as any).cookies?.refreshToken ||
        req.body?.refreshToken ||
        (req.query as any)?.refreshToken ||
        (typeof req.headers.authorization === 'string' &&
        req.headers.authorization.startsWith('Bearer ')
          ? req.headers.authorization.split(' ')[1]
          : undefined);

      const data = await usersService.refresh(refreshToken as string);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAllUsers();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
