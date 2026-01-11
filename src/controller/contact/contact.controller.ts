import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContactService } from '../../services/contact/contact.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createContactSchema } from '../../common/validation/zod.schemas';

@Controller('contact')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidationPipe(createContactSchema)) body: any) {
    const contact = await this.contactService.create(body);
    return this.responseService.created(contact);
  }

  @Get()
  async findAll(@Query() query: { limit?: number; offset?: number }) {
    const contacts = await this.contactService.findAll(query);
    return this.responseService.success(contacts);
  }
}

