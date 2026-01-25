import { z } from 'zod';

const email = z.string().trim().email('Invalid email format');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100);
const uuid = z.uuid();

export const registrationSchema = z.object({
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const tokenPayloadSchema = z.object({
  id: uuid,
  email,
  isActivated: z.boolean(),
});

export const refreshTokenInputSchema = z
  .string()
  .min(1, 'Refresh token is required');
export const activationLinkSchema = uuid.describe('Activation link');

export type RegistrationDto = z.infer<typeof registrationSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenInputSchema>;
export type ActivationLink = z.infer<typeof activationLinkSchema>;
