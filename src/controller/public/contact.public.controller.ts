import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicContactService } from '../../services/public/public-contact.service';
import { ContactSubmissionDto } from '../../dtos/public/contact-submission.dto';

@ApiTags('public-contact')
@Controller('public/contact')
export class ContactPublicController {
  constructor(private readonly contactService: PublicContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a contact form message' })
  @ApiBody({ type: ContactSubmissionDto })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async submitContact(@Body() body: ContactSubmissionDto) {
    return this.contactService.submitContact(body);
  }
}
