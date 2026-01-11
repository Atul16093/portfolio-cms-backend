import { Injectable } from '@nestjs/common';
import { ContactQuery, ContactCreateInput } from '../../models/queries/contact.query';
import { ResponseService } from '../../core/response-management';

@Injectable()
export class ContactService {
  constructor(
    private contactQuery: ContactQuery,
    private responseService: ResponseService,
  ) {}

  async create(input: ContactCreateInput): Promise<any> {
    // Business logic: Could add rate limiting, spam detection, etc.
    return this.contactQuery.create(input);
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<any[]> {
    return this.contactQuery.findAll(options);
  }
}

