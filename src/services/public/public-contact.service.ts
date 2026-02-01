import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PublicContactQuery } from '../../models/queries/public/public-contact.query';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
});

@Injectable()
export class PublicContactService {
  constructor(private readonly contactQuery: PublicContactQuery) {}

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
    if (recentCount >= 3) {
      throw new HttpException(
        'Too many submissions from this email address. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.contactQuery.create(data);
    return { success: true, message: 'Message sent successfully' };
  }
}
