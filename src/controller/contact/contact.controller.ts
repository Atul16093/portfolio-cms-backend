import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ContactService } from '../../services/contact/contact.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createContactSchema, contactIdSchema } from '../../common/validation/zod.schemas';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ContactResponseDto } from '../../models/dtos/contact.dto';

@ApiTags('contact')
@Controller()
export class ContactController {
  constructor(
    private contactService: ContactService,
    private responseService: ResponseService,
  ) {}

  @Post('contact')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form', description: 'Submit a new contact form message (Public)' })
  @ApiResponse({ status: 201, description: 'Contact message created successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body(new ZodValidationPipe(createContactSchema)) body: any) {
    const contact = await this.contactService.create(body);
    return this.responseService.created(contact);
  }

  // CMS ROUTES
  
  @Get('cms/contacts')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all contact messages', description: 'Get a list of all contact form messages (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'List of contact messages', type: StandardApiResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: { limit?: number; offset?: number }) {
    // Validate/Parse query params? Nest does some type coercion but safe to ensure numbers
    const options = {
      limit: query.limit ? Number(query.limit) : undefined,
      offset: query.offset ? Number(query.offset) : undefined,
    };
    const contacts = await this.contactService.findAll(options);
    return this.responseService.success(contacts);
  }

  @Get('cms/contacts/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get contact details', description: 'Get full details of a contact message (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contact ID', type: String })
  @ApiResponse({ status: 200, description: 'Contact details', type: StandardApiResponseDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param() params: { id: string }) { // Using simple object for param validation via pipe if needed, or just manual
     // Manual id validation using regex or Zod pipe if we wanted strict
     // The contactService checks existence
     const contact = await this.contactService.getById(params.id);
     return this.responseService.success(contact);
  }

  @Patch('cms/contacts/:id/read')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark contact as read', description: 'Change status from new to read (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contact ID', type: String })
  @ApiResponse({ status: 200, description: 'Contact marked as read', type: StandardApiResponseDto })
  async markAsRead(@Param() params: { id: string }) {
    const contact = await this.contactService.markAsRead(params.id);
    return this.responseService.success(contact);
  }

  @Patch('cms/contacts/:id/archive')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Archive contact', description: 'Change status to archived (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contact ID', type: String })
  @ApiResponse({ status: 200, description: 'Contact archived', type: StandardApiResponseDto })
  async archive(@Param() params: { id: string }) {
    const contact = await this.contactService.archive(params.id);
    return this.responseService.success(contact);
  }
}

