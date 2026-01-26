import { z } from 'zod';

const emailAddress = z.email('Invalid email address');
const nonEmptyString = z.string().min(1);

export const gmailOAuthConfigSchema = z
  .object({
    user: emailAddress.describe('Gmail address'),
    clientId: nonEmptyString.describe('OAuth Client ID'),
    clientSecret: nonEmptyString.describe('OAuth Client Secret'),
    refreshToken: nonEmptyString.describe('OAuth Refresh Token'),
  })
  .strict();

export const smtpConfigSchema = z
  .object({
    host: nonEmptyString.describe('SMTP host'),
    port: z.coerce.number().int().positive().default(587),
    secure: z.boolean().default(false),
    user: z.string().optional(),
    pass: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.user && !data.pass) return false;
      if (data.pass && !data.user) return false;
      return true;
    },
    {
      message:
        'Both user and password must be provided together for authentication',
    },
  );

export type GmailOAuthConfig = z.infer<typeof gmailOAuthConfigSchema>;
export type SmtpConfig = z.infer<typeof smtpConfigSchema>;
