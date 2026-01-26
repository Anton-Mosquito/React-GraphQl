import { env } from '#config/env.js';
import { ApiError, logger } from '#utils/index.js';
import {
  gmailOAuthConfigSchema,
  smtpConfigSchema,
  type GmailOAuthConfig,
  type SmtpConfig,
} from '#schema/index.js';
import nodemailer, { Transporter } from 'nodemailer';

class MailService {
  private transporter: Transporter | null = null;
  private initializationAttempted = false;
  private initializationError: Error | null = null;

  /**
   * Lazy initialization of mail transporter
   * Creates transporter only when first email is sent
   * Tries Gmail OAuth2 first, falls back to generic SMTP
   */
  private initializeTransporter(): void {
    if (this.initializationAttempted) {
      if (this.initializationError) {
        throw this.initializationError;
      }
      return;
    }

    this.initializationAttempted = true;

    try {
      const gmailConfig = this.tryGmailOAuthConfig();
      if (gmailConfig) {
        this.transporter = this.createGmailTransporter(gmailConfig);
        logger.info('Mail service initialized with Gmail OAuth2');
        return;
      }

      const smtpConfig = this.trySmtpConfig();
      if (smtpConfig) {
        this.transporter = this.createSmtpTransporter(smtpConfig);
        logger.info('Mail service initialized with SMTP', {
          host: smtpConfig.host,
          port: smtpConfig.port,
        });
        return;
      }

      const error = new Error(
        'Mail service is not configured. Please set either Gmail OAuth2 or SMTP credentials in environment variables.',
      );
      this.initializationError = error;
      throw error;
    } catch (error) {
      this.initializationError =
        error instanceof Error
          ? error
          : new Error('Unknown mail service initialization error');
      throw this.initializationError;
    }
  }

  /**
   * Try to parse Gmail OAuth2 configuration from environment
   */
  private tryGmailOAuthConfig(): GmailOAuthConfig | null {
    const result = gmailOAuthConfigSchema.safeParse({
      user: env.MAIL_USER,
      clientId: env.OAUTH_CLIENT_ID,
      clientSecret: env.OAUTH_CLIENT_SECRET,
      refreshToken: env.OAUTH_REFRESH_TOKEN,
    });

    if (result.success) {
      logger.debug('Gmail OAuth2 configuration is valid');
      return result.data;
    }

    logger.debug('Gmail OAuth2 configuration not available', {
      errors: result.error.issues,
    });
    return null;
  }

  /**
   * Try to parse generic SMTP configuration from environment
   */
  private trySmtpConfig(): SmtpConfig | null {
    if (!env.SMTP_HOST) {
      logger.debug('SMTP configuration not available (SMTP_HOST not set)');
      return null;
    }

    const result = smtpConfigSchema.safeParse({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    });

    if (result.success) {
      logger.debug('SMTP configuration is valid');
      return result.data;
    }

    logger.debug('SMTP configuration is invalid', {
      errors: result.error.issues,
    });
    return null;
  }

  /**
   * Create Gmail OAuth2 transporter
   */
  private createGmailTransporter(config: GmailOAuthConfig): Transporter {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.user,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
      },
    });
  }

  /**
   * Create generic SMTP transporter
   */
  private createSmtpTransporter(config: SmtpConfig): Transporter {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth:
        config.user && config.pass
          ? {
              user: config.user,
              pass: config.pass,
            }
          : undefined,
    });
  }

  /**
   * Send account activation email
   * @throws ApiError if mail service is not configured or sending fails
   */
  async sendActivationMail(to: string, activationLink: string): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw ApiError.BadRequest('Invalid email address');
    }
    const validatedEmail = to;

    this.initializeTransporter();

    if (!this.transporter) {
      throw ApiError.Internal('Mail transporter not available');
    }

    const from = env.MAIL_FROM || env.MAIL_USER || 'no-reply@example.com';
    const subject = env.MAIL_ACTIVATION_SUBJECT || 'Activate your account';

    const html = this.generateActivationEmailHtml(activationLink);

    try {
      logger.debug('Sending activation email', {
        to: validatedEmail,
        from,
      });

      await this.transporter.sendMail({
        from,
        to: validatedEmail,
        subject,
        html,
      });

      logger.info('Activation email sent successfully', {
        to: validatedEmail,
      });
    } catch (error) {
      logger.error('Failed to send activation email', {
        to: validatedEmail,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw ApiError.Internal('Failed to send activation email');
    }
  }

  /**
   * Generate HTML content for activation email
   */
  private generateActivationEmailHtml(activationLink: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Activation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f4f4f4;
            border-radius: 5px;
            padding: 30px;
          }
          h2 {
            color: #2c3e50;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #2980b9;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Account Activation</h2>
          <p>Thank you for registering! Please click the button below to activate your account:</p>
          <a href="${activationLink}" class="button">Activate Account</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #3498db;">${activationLink}</p>
          <div class="footer">
            <p>If you didn't create this account, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Check if mail service is configured and ready
   */
  isConfigured(): boolean {
    try {
      this.initializeTransporter();
      return this.transporter !== null;
    } catch {
      return false;
    }
  }

  /**
   * Send test email (for debugging/testing)
   * Should only be used in development
   */
  async sendTestEmail(to: string): Promise<void> {
    if (env.NODE_ENV === 'production') {
      throw ApiError.Forbidden('Test emails not allowed in production');
    }

    await this.sendActivationMail(to, 'https://example.com/test-activation');
  }
}

export default new MailService();
