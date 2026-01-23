import nodemailer from 'nodemailer';
import { ApiError } from '../../utils/errors.js';

class MailService {
  transporter: nodemailer.Transporter;

  constructor() {
    const user = process.env.MAIL_USER;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

    if (user && clientId && clientSecret && refreshToken) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user,
          clientId,
          clientSecret,
          refreshToken,
        },
      });
    } else if (process.env.SMTP_HOST) {
      // Fallback to generic SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // As last resort create a stub transport that throws on send
      this.transporter = {
        sendMail: async () => {
          throw ApiError.Internal('Mail transporter is not configured');
        },
      } as unknown as nodemailer.Transporter;
    }
  }

  async sendActivationMail(to: string, activationLink: string) {
    const from =
      process.env.MAIL_FROM || process.env.MAIL_USER || 'no-reply@example.com';
    const subject =
      process.env.MAIL_ACTIVATION_SUBJECT || 'Activate your account';
    const html = `<p>Please click the link to activate your account:</p><p><a href="${activationLink}">${activationLink}</a></p>`;

    try {
      return this.transporter.sendMail({ from, to, subject, html });
    } catch (error) {
      throw ApiError.Internal('Failed to send activation email');
    }
  }
}

export default new MailService();
