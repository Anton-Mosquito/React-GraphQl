import { z } from 'zod';
import prisma from '../../lib/db.js';
import { ApiError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

const ActivationLinkSchema = z.string().uuid('Invalid activation link format');

class ActivationService {
  /**
   * Activate user account by activation link
   */
  async activate(input: unknown): Promise<void> {
    const activationLink = ActivationLinkSchema.parse(input);

    logger.debug('ActivationService.activate', { activationLink });

    // Find user by activation link
    const user = await prisma.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      throw ApiError.BadRequest('Invalid activation link');
    }

    // Check if already activated
    if (user.isActivated) {
      logger.debug('User already activated', { userId: user.id });
      return;
    }

    // Activate user and remove activation link
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActivated: true,
        activationLink: null,
      },
    });

    logger.info('User activated', { userId: user.id, email: user.email });
  }

  /**
   * Resend activation email (future feature)
   * Can be implemented when needed
   */
  async resendActivation(): Promise<void> {
    // TODO: Implement if needed
    throw ApiError.NotFound('Feature not implemented');
  }
}

export default new ActivationService();
