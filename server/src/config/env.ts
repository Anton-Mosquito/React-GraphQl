import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().int().positive().default(5001),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url(),

  // URLs
  CLIENT_URL: z.string().url(),
  API_URL: z.string().url(),

  // TMDB API
  TMDB_API_KEY: z.string().min(1),
  TMDB_API_BASE_URL: z.string().url(),
  TMDB_IMAGE_BASE_PATH: z.string().url(),

  // JWT Secrets
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT Access Secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT Refresh Secret must be at least 32 characters'),

  // JWT Expiration (optional with defaults)
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // CORS
  ALLOWED_ORIGINS: z.string().optional(),

  // Mail
  MAIL_USER: z.string().min(1),
  OAUTH_CLIENT_ID: z.string().min(1),
  OAUTH_CLIENT_SECRET: z.string().min(1),
  OAUTH_REFRESH_TOKEN: z.string().min(1),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().email().optional(),
  MAIL_ACTIVATION_SUBJECT: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// Export the type for use in other files
export type Env = z.infer<typeof envSchema>;

// Default export for backwards compatibility
export default env;
