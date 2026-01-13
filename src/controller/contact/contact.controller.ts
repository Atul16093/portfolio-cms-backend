import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContactService } from '../../services/contact/contact.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createContactSchema } from '../../common/validation/zod.schemas';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form', description: 'Submit a new contact form message' })
  @ApiResponse({ status: 201, description: 'Contact message created successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body(new ZodValidationPipe(createContactSchema)) body: any) {
    const contact = await this.contactService.create(body);
    return this.responseService.created(contact);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all contact messages', description: 'Get a list of all contact form messages (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'List of contact messages', type: StandardApiResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: { limit?: number; offset?: number }) {
    const contacts = await this.contactService.findAll(query);
    return this.responseService.success(contacts);
  }
}

