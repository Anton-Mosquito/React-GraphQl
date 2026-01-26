import prisma from '../../lib/db.js';
import { logger, ApiError } from '#utils/index.js';
import { activationLinkSchema } from '#schema/index.js';

class ActivationService {
  /**
   * Activate user account by activation link
   */
  async activate(input: unknown): Promise<void> {
    const activationLink = activationLinkSchema.parse(input);

    logger.debug('ActivationService.activate', { activationLink });

    const user = await prisma.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      throw ApiError.BadRequest('Invalid activation link');
    }

    if (user.isActivated) {
      logger.debug('User already activated', { userId: user.id });
      return;
    }

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
