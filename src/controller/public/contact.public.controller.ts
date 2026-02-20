import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicContactService } from '../../services/public/public-contact.service';
import { z } from 'zod';
import { ContactMessages } from '../../common/constants/contact.constants';

const contactSchema = z.object({
  name: z.string().min(2, ContactMessages.NAME_TOO_SHORT).max(100, ContactMessages.NAME_TOO_LONG),
  email: z.string().email(ContactMessages.INVALID_EMAIL),
  message: z.string().min(10, ContactMessages.MESSAGE_TOO_SHORT).max(100, ContactMessages.MESSAGE_TOO_LONG),
});

export type ContactSubmissionDto = z.infer<typeof contactSchema>;

@ApiTags('public-contact')
@Controller('public/contact')
export class ContactPublicController {
  constructor(private readonly contactService: PublicContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a contact form message' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async submitContact(@Body() body: ContactSubmissionDto) {
    return this.contactService.submitContact(body);
  }
}
