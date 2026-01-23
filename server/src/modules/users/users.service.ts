import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/db.js';
import tokenService from '../auth/token.service.js';
import mailService from '../auth/mail.service.js';
import UserDto from './dtos/user.dto.js';
import { ApiError } from '../../utils/errors.js';

class UsersService {
  async registration(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw ApiError.BadRequest('User already exists');
    }

    const hash = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        activationLink,
      },
    });

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });

    try {
      const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
      const activationUrl = `${CLIENT_URL}/activate/${activationLink}`;
      await mailService.sendActivationMail(email, activationUrl);
    } catch (err) {
      // non-fatal: log and continue
    }

    const tokens = tokenService.generateTokens(userDto);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink: string) {
    const user = await prisma.user.findFirst({ where: { activationLink } });
    if (!user) {
      throw ApiError.BadRequest('Invalid activation link');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActivated: true, activationLink: null },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('User not found');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });
    const tokens = tokenService.generateTokens(userDto);

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.Unauthorized('No refresh token provided');
    }

    const userData = tokenService.validateRefreshToken<any>(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.Unauthorized('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    if (!user) {
      throw ApiError.Unauthorized('User not found');
    }

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    });
    const tokens = tokenService.generateTokens(userDto);

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users.map(
      (u) =>
        new UserDto({ id: u.id, email: u.email, isActivated: u.isActivated }),
    );
  }
}

export default new UsersService();
