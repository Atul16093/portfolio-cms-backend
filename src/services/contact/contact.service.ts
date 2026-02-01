import { Injectable } from '@nestjs/common';
import { ContactQuery, ContactCreateInput } from '../../models/queries/contact.query';
import { ResponseService } from '../../core/response-management';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class ContactService {
  constructor(
    private contactQuery: ContactQuery,
    private responseService: ResponseService,
    private activityLogService: ActivityLogService,
  ) {}

  async create(input: ContactCreateInput): Promise<any> {
    // Business logic: Could add rate limiting, spam detection, etc.
    const contact = await this.contactQuery.create(input);
    
    // Log activity: contact received
    // Contact ID is integer in database (from increments), but mapped as string in entity
    // Convert to number for activity log
    const contactId = typeof contact.id === 'string' ? parseInt(contact.id, 10) : Number(contact.id);
    if (!isNaN(contactId) && contactId > 0) {
      await this.activityLogService.logContactActivity(
        contactId,
        contact.name,
        contact.email,
      );
    }
    
    return contact;
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<any[]> {
    return this.contactQuery.findAll(options);
  }
}

