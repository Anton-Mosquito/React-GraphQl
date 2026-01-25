import { z } from 'zod';
import prisma from '../../lib/db.js';
import UserDto from './dtos/user.dto.js';
import { ApiError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

const UserIdSchema = z.string().uuid('Invalid user ID format');

class UsersService {
  /**
   * Get all users
   * Returns list of users without sensitive data
   */
  async getAllUsers(): Promise<UserDto[]> {
    logger.debug('UsersService.getAllUsers');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isActivated: true,
      },
    });

    return users.map(
      (user) =>
        new UserDto({
          id: user.id,
          email: user.email,
          isActivated: user.isActivated,
        }),
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(input: unknown): Promise<UserDto> {
    const userId = UserIdSchema.parse(input);

    logger.debug('UsersService.getUserById', { userId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isActivated: true,
      },
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
    }

    return new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });
  }

  /**
   * Delete user by ID (future feature)
   */
  async deleteUser(input: unknown): Promise<void> {
    const userId = UserIdSchema.parse(input);

    logger.debug('UsersService.deleteUser', { userId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
    }

    // Delete user's tokens first
    await prisma.token.deleteMany({
      where: { userId },
    });

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info('User deleted', { userId });
  }
}

export default new UsersService();
