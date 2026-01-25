import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '../../lib/db.js';
import tokenService from './token.service.js';
import mailService from './mail.service.js';
import UserDto from '../users/dtos/user.dto.js';
import { ApiError } from '../../utils/errors.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

// Input validation schemas
const RegistrationInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});

const LoginInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegistrationInput = z.infer<typeof RegistrationInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;

class AuthService {
  /**
   * Register new user
   * Creates user, generates tokens, sends activation email
   */
  async register(input: unknown) {
    const { email, password } = RegistrationInputSchema.parse(input);

    logger.debug('AuthService.register', { email });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest('User with this email already exists');
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = uuidv4();

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        activationLink,
      },
    });

    logger.info('User registered', { userId: user.id, email: user.email });

    // Create user DTO
    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    // Generate JWT tokens
    const tokens = tokenService.generateTokens(userDto);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    // Send activation email (non-blocking, errors are logged but don't fail registration)
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
    const { email, password } = LoginInputSchema.parse(input);

    logger.debug('AuthService.login', { email });

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.BadRequest('Invalid credentials');
    }

    logger.info('User logged in', { userId: user.id, email: user.email });

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

  /**
   * Logout user by removing refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      logger.debug('AuthService.logout - no token provided');
      return;
    }

    logger.debug('AuthService.logout');
    await tokenService.removeToken(refreshToken);
  }

  /**
   * Send activation email to user (private method)
   */
  private async sendActivationEmail(
    email: string,
    activationLink: string,
  ): Promise<void> {
    const activationUrl = `${env.CLIENT_URL}/activate/${activationLink}`;
    await mailService.sendActivationMail(email, activationUrl);
    logger.debug('Activation email sent', { email });
  }
}

export default new AuthService();
