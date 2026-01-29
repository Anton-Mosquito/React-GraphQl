import prisma from '../../lib/db.js';
import { logger, ApiError } from '#utils/index.js';
import { activationLinkSchema } from '#schema/index.js';

class ActivationService {
  /**
   * Activate user account by activation link
   */
  async activate(
    input: unknown,
  ): Promise<{ success: boolean; message: string }> {
    const activationLink = activationLinkSchema.parse(input);

    logger.debug('ActivationService.activate', { activationLink });

    const user = await prisma.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      logger.warn('Activation link not found or already used', {
        activationLink,
      });
      return {
        success: false,
        message: 'Activation link is invalid or has already been used',
      };
    }

    if (user.isActivated) {
      logger.debug('User already activated', { userId: user.id });
      return {
        success: true,
        message: 'Account is already activated',
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActivated: true,
        activationLink: null,
      },
    });

    logger.info('User activated', { userId: user.id, email: user.email });

    return {
      success: true,
      message: 'Account activated successfully',
    };
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
