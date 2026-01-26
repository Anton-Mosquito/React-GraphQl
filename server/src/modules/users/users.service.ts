import prisma from '../../lib/db.js';
import { userIdSchema } from '#schema/index.js';
import { ApiError, logger } from '#utils/index.js';
import { UserDto } from '#modules/index.js';

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
    const userId = userIdSchema.parse(input);

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
    const userId = userIdSchema.parse(input);

    logger.debug('UsersService.deleteUser', { userId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.NotFound('User not found');
    }

    await prisma.token.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info('User deleted', { userId });
  }
}

export default new UsersService();
