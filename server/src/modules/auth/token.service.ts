import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../../lib/db.js';
import { ApiError } from '../../utils/errors.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/index.js';

// Zod schema for JWT payload validation
const TokenPayloadSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  isActivated: z.boolean(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

class TokenService {
  private accessSecret: Secret;
  private refreshSecret: Secret;
  private accessExpiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    // Use validated env values; no fallback secrets
    this.accessSecret = env.JWT_ACCESS_SECRET;
    this.refreshSecret = env.JWT_REFRESH_SECRET;
    this.accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
    this.refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
  }

  /**
   * Generate access and refresh tokens
   * @param payload - User data to encode in token
   * @returns Object with accessToken and refreshToken
   */
  generateTokens(payload: TokenPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const validatedPayload = TokenPayloadSchema.parse(payload);

    const accessToken = jwt.sign(
      validatedPayload as object,
      this.accessSecret as Secret,
      { expiresIn: this.accessExpiresIn } as unknown as SignOptions,
    );

    const refreshToken = jwt.sign(
      validatedPayload as object,
      this.refreshSecret as Secret,
      { expiresIn: this.refreshExpiresIn } as unknown as SignOptions,
    );

    return { accessToken, refreshToken };
  }

  /**
   * Save refresh token to database
   * Removes old tokens for the user before saving new one
   */
  async saveToken(userId: string, refreshToken: string): Promise<void> {
    try {
      await prisma.token.deleteMany({ where: { userId } });
      await prisma.token.create({
        data: { refreshToken, userId },
      });
    } catch (error) {
      logger.error('Failed to save refresh token', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw ApiError.Internal('Failed to save refresh token');
    }
  }

  /**
   * Remove refresh token from database
   */
  async removeToken(refreshToken: string): Promise<void> {
    try {
      await prisma.token.deleteMany({ where: { refreshToken } });
    } catch (error) {
      logger.error('Failed to remove refresh token', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw ApiError.Internal('Failed to remove refresh token');
    }
  }

  /**
   * Find refresh token in database
   */
  async findToken(
    refreshToken: string,
  ): Promise<{ id: string; refreshToken: string; userId: string } | null> {
    try {
      return await prisma.token.findUnique({ where: { refreshToken } });
    } catch (error) {
      logger.error('Failed to find refresh token', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw ApiError.Internal('Failed to find refresh token');
    }
  }

  /**
   * Validate access token and return decoded payload
   * @returns Validated payload or null if token is invalid
   */
  validateAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessSecret as Secret);
      return TokenPayloadSchema.parse(decoded as object);
    } catch {
      return null;
    }
  }

  /**
   * Validate refresh token and return decoded payload
   * @returns Validated payload or null if token is invalid
   */
  validateRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret as Secret);
      return TokenPayloadSchema.parse(decoded as object);
    } catch {
      return null;
    }
  }
}

export default new TokenService();
