import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async getById(id: string): Promise<any> {
    const contact = await this.contactQuery.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async markAsRead(id: string): Promise<any> {
    const contact = await this.getById(id);
    
    if (contact.status === 'read' || contact.status === 'archived') {
      return contact; // Idempotent
    }
    
    if (contact.status !== 'new') {
      // Should not happen given check above, but purely for strict flow logic
      throw new BadRequestException(`Cannot mark as read from status ${contact.status}`);
    }

    return this.contactQuery.updateStatus(id, 'read');
  }

  async archive(id: string): Promise<any> {
     const contact = await this.getById(id);
     
     if (contact.status === 'archived') {
       return contact;
     }

     // Allow archiving from 'new' or 'read'
     return this.contactQuery.updateStatus(id, 'archived');
  }
}

