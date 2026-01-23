import { z } from 'zod';

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(32),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegistrationDto = z.infer<typeof registrationSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
