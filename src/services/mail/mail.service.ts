import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { template } from './template/portfolioMail.template';
import { ContactMessages } from '../../common/constants/contact.constants';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevoUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(private configService: ConfigService) {}

  /**
   * Sends a transactional email via Brevo HTTP API
   */
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = this.configService.get<string>('mail.brevoApiKey');
    const fromEmail = this.configService.get<string>('mail.from');

    if (!apiKey) {
      this.logger.error('BREVO_API_KEY is not configured in environment variables');
      throw new Error('Email service configuration error');
    }

    try {
      const response = await axios.post(
        this.brevoUrl,
        {
          sender: { email: fromEmail },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
      );

      this.logger.log(`Email sent successfully to ${to}. Message ID: ${response.data.messageId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      this.logger.error(`Failed to send email to ${to}: ${errorMessage}`, error.stack);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  /**
   * Sends a notification to the admin about a new contact request
   */
  async sendNewContactNotification(contact: { name: string; email: string; message: string }) {
    const adminEmail = this.configService.get<string>('mail.to');
    
    if (!adminEmail) {
      this.logger.warn(ContactMessages.ADMIN_EMAIL_NOT_CONFIGURED);
      return;
    }

    const subject = `New Contact Request from ${contact.name}`;
    const html = template(contact);

    await this.sendMail(adminEmail, subject, html);
  }
}
