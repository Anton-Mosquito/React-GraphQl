import { z } from 'zod';
import prisma from '../../lib/db.js';
import tokenService from './token.service.js';
import UserDto from '../users/dtos/user.dto.js';
import { ApiError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

const RefreshTokenInputSchema = z.string().min(1, 'Refresh token is required');

class SessionService {
  /**
   * Refresh access token using refresh token
   * Validates refresh token, checks database, generates new tokens
   */
  async refresh(input: unknown) {
    const refreshToken = RefreshTokenInputSchema.parse(input);

    logger.debug('SessionService.refresh');

    // Validate refresh token JWT signature
    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.Unauthorized('Invalid refresh token');
    }

    // Check if token exists in database
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenFromDb) {
      throw ApiError.Unauthorized('Refresh token not found');
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user) {
      throw ApiError.Unauthorized('User not found');
    }

    logger.info('Session refreshed', { userId: user.id });

    // Create user DTO
    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    // Generate new tokens
    const tokens = tokenService.generateTokens(userDto);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

export default new SessionService();
