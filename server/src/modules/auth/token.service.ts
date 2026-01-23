import jwt from 'jsonwebtoken';
import prisma from '../../lib/db.js';
import { ApiError } from '../../utils/errors.js';

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_ACCESS_TOKEN_SECRET ||
  'access-secret';
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_REFRESH_TOKEN_SECRET ||
  'refresh-secret';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

class TokenService {
  generateTokens(payload: unknown) {
    const accessToken = jwt.sign(
      payload as string | object | Buffer,
      ACCESS_TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      } as jwt.SignOptions,
    );

    const refreshToken = jwt.sign(
      payload as string | object | Buffer,
      REFRESH_TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      } as jwt.SignOptions,
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    try {
      // Upsert semantics: delete existing token for user or create new
      await prisma.token.deleteMany({ where: { userId } });
      return prisma.token.create({
        data: { refreshToken, userId },
      });
    } catch (error) {
      throw ApiError.Internal('Failed to save refresh token');
    }
  }

  async removeToken(refreshToken: string) {
    try {
      return prisma.token.deleteMany({ where: { refreshToken } });
    } catch (error) {
      throw ApiError.Internal('Failed to remove refresh token');
    }
  }

  async findToken(refreshToken: string) {
    try {
      return prisma.token.findUnique({ where: { refreshToken } });
    } catch (error) {
      throw ApiError.Internal('Failed to find refresh token');
    }
  }

  validateAccessToken<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as T;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as T;
    } catch (e) {
      return null;
    }
  }
}

export default new TokenService();
