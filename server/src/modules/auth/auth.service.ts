import { env } from '#config/env.js';
import { MailService, TokenService, UserDto } from '#modules/index.js';
import { ApiError, logger } from '#utils/index.js';
import { loginSchema, registrationSchema } from '#schema/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/db.js';

class AuthService {
  /**
   * Register new user
   * Creates user, generates tokens, sends activation email
   */
  async register(input: unknown) {
    const { email, password } = registrationSchema.parse(input);

    logger.debug('AuthService.register', { email });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        activationLink,
      },
    });

    logger.info('User registered', { userId: user.id, email: user.email });

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    const tokens = TokenService.generateTokens(userDto);
    await TokenService.saveToken(user.id, tokens.refreshToken);

    this.sendActivationEmail(email, activationLink).catch((error) => {
      logger.error('Failed to send activation email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });

    return { ...tokens, user: userDto };
  }

  /**
   * Login existing user
   * Validates credentials and generates new tokens
   */
  async login(input: unknown) {
    const { email, password } = loginSchema.parse(input);

    logger.debug('AuthService.login', { email });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.BadRequest('Invalid credentials');
    }

    logger.info('User logged in', { userId: user.id, email: user.email });

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    const tokens = TokenService.generateTokens(userDto);
    await TokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  /**
   * Logout user by removing refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      logger.debug('AuthService.logout - no token provided');
      return;
    }

    logger.debug('AuthService.logout');
    await TokenService.removeToken(refreshToken);
  }

  /**
   * Send activation email to user (private method)
   */
  private async sendActivationEmail(
    email: string,
    activationLink: string,
  ): Promise<void> {
    const activationUrl = `${env.CLIENT_URL}/activate/${activationLink}`;
    await MailService.sendActivationMail(email, activationUrl);
    logger.debug('Activation email sent', { email });
  }
}

export default new AuthService();
