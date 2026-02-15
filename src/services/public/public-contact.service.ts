import { Injectable, BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PublicContactQuery } from '../../models/queries/public/public-contact.query';
import { MailService } from '../mail/mail.service';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
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
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validation.error.format(),
      });
    }

    // Basic Rate Limiting: Check submissions from this email in last hour
    const recentCount = await this.contactQuery.countRecentByEmail(data.email, 60);
    if (recentCount >= 5) { // Increased limit slightly
      throw new HttpException(
        'Too many submissions from this email address. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check existing contact for notification logic
    // We check BEFORE saving the new one to avoid finding the current one
    const lastContact = await this.contactQuery.findLastByEmail(data.email);
    
    // Save the contact first to ensure data persistence
    await this.contactQuery.create(data);

    // Notification Logic:
    // 1. If no previous contact, send email.
    // 2. If previous contact exists, check if it was created < 24 hours ago.
    //    If < 24h, DO NOT send email.
    //    If > 24h, send email.
    
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

    return { success: true, message: 'Message sent successfully' };
  }
}
