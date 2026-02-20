import { Injectable, BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PublicContactQuery } from '../../models/queries/public/public-contact.query';
import { MailService } from '../mail/mail.service';
import { z } from 'zod';
import { ResponseCode } from '../../common/enums/response-codes.enum';
import { ContactMessages } from '../../common/constants/contact.constants';

const contactSchema = z.object({
  name: z.string().min(2, ContactMessages.NAME_TOO_SHORT).max(100, ContactMessages.NAME_TOO_LONG),
  email: z.string().email(ContactMessages.INVALID_EMAIL),
  message: z.string().min(10, ContactMessages.MESSAGE_TOO_SHORT).max(2000, ContactMessages.MESSAGE_TOO_LONG),
});

@Injectable()
export class PublicContactService {
  private readonly logger = new Logger(PublicContactService.name);

  constructor(
    private readonly contactQuery: PublicContactQuery,
    private readonly mailService: MailService,
  ) {}

  async submitContact(data: { name: string; email: string; message: string }) {
    // Zod Validation
    const validation = contactSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || ContactMessages.INVALID_INPUT;
      throw new BadRequestException({
        message: firstError,
        errors: validation.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
        code: ResponseCode.VALIDATION_ERROR,
      });
    }

    // Basic Rate Limiting: Check submissions from this email in last hour
    const recentCount = await this.contactQuery.countRecentByEmail(data.email, 60);
    if (recentCount >= 5) {
      this.logger.warn(`Rate limit exceeded for email: ${data.email}`);
      throw new HttpException({
        message: ContactMessages.RATE_LIMIT_EXCEEDED,
        code: ResponseCode.RATE_LIMIT_EXCEEDED,
      }, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Check existing contact for notification logic
    const lastContact = await this.contactQuery.findLastByEmail(data.email);
    
    // Save the contact first to ensure data persistence
    try {
      await this.contactQuery.create(data);
    } catch (error) {
      this.logger.error(`Failed to save contact for ${data.email}`, error);
      throw new HttpException({
        message: ContactMessages.DATABASE_SAVE_ERROR,
        code: ResponseCode.DATABASE_ERROR,
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }

    // Notification Logic:
    let shouldSendEmail = true;

    if (lastContact) {
      const now = new Date();
      const lastCreated = new Date(lastContact.created_at);
      const diffMs = now.getTime() - lastCreated.getTime();
      const hoursDiff = diffMs / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        shouldSendEmail = false;
        this.logger.log(`Skipping email notification for ${data.email}. Last contact was ${hoursDiff.toFixed(2)} hours ago.`);
      }
    }

    if (shouldSendEmail) {
      try {
        await this.mailService.sendNewContactNotification(data);
        this.logger.log(`Email notification sent for ${data.email}`);
      } catch (error) {
        // Log error but don't fail the request since data is saved
        this.logger.error(`Failed to send email notification for ${data.email}`, error);
      }
    }

    return { 
      success: true, 
      message: ContactMessages.SUBMISSION_SUCCESS,
      code: ResponseCode.CONTACT_SUBMITTED_SUCCESSFULLY
    };
  }
}
