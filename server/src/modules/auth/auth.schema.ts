import { z } from 'zod';

// These schemas are now duplicated in auth.service.ts
// Keep them here for REST validation middleware
export const registrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegistrationDto = z.infer<typeof registrationSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
