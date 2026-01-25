import prisma from '../../lib/db.js';
import { TokenService } from '#modules/index.js';
import UserDto from '../users/dtos/user.dto.js';
import { ApiError, logger } from '#utils/index.js';
import { refreshTokenInputSchema } from '#schema/auth.schema.js';

class SessionService {
  /**
   * Refresh access token using refresh token
   * Validates refresh token, checks database, generates new tokens
   */
  async refresh(input: unknown) {
    const refreshToken = refreshTokenInputSchema.parse(input);

    logger.debug('SessionService.refresh');

    const userData = TokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw ApiError.Unauthorized('Invalid refresh token');
    }

    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!tokenFromDb) {
      throw ApiError.Unauthorized('Refresh token not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user) {
      throw ApiError.Unauthorized('User not found');
    }

    logger.info('Session refreshed', { userId: user.id });

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    const tokens = TokenService.generateTokens(userDto);
    await TokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

export default new SessionService();
