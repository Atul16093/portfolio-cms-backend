import { Injectable } from '@nestjs/common';
import { ActivityLogQuery, ActivityLogCreateInput } from '../../models/queries/activity-log.query';
import { Knex } from 'knex';
import { DatabaseConnection } from '../../db/database.connection';

/**
 * Service layer for activity logging
 * Provides high-level methods for logging different types of activities
 * Handles activity message formatting and context
 */
@Injectable()
export class ActivityLogService {
  constructor(
    private activityLogQuery: ActivityLogQuery,
    private dbConnection: DatabaseConnection,
  ) {}

  /**
   * Log a project-related activity
   * Creates activity log entry for project operations
   */
  async logProjectActivity(
    activityType: 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_PUBLISHED' | 'PROJECT_UNPUBLISHED',
    projectId: number,
    projectTitle: string,
    adminUserId?: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const messages = {
      PROJECT_CREATED: `Project "${projectTitle}" was created`,
      PROJECT_UPDATED: `Project "${projectTitle}" was updated`,
      PROJECT_PUBLISHED: `Project "${projectTitle}" was published`,
      PROJECT_UNPUBLISHED: `Project "${projectTitle}" was unpublished`,
    };

    const input: ActivityLogCreateInput = {
      activityType,
      message: messages[activityType],
      entityType: 'project',
      entityId: projectId,
      entityLabel: projectTitle,
      adminUserId,
    };

    if (trx) {
      await this.activityLogQuery.createInTransaction(trx, input);
    } else {
      await this.activityLogQuery.create(input);
    }
  }

  /**
   * Log a contact-related activity
   * Creates activity log entry when new contact message is received
   */
  async logContactActivity(
    contactId: number,
    contactName: string,
    contactEmail: string,
  ): Promise<void> {
    await this.activityLogQuery.create({
      activityType: 'CONTACT_RECEIVED',
      message: `New contact message from ${contactName} (${contactEmail})`,
      entityType: 'contact',
      entityId: contactId,
      entityLabel: `${contactName} - ${contactEmail}`,
    });
  }

  /**
   * Log an admin session activity
   * Creates activity log entry for login, logout, and session revocation
   */
  async logSessionActivity(
    activityType: 'ADMIN_LOGIN' | 'ADMIN_LOGOUT' | 'SESSION_REVOKED',
    adminUserId: number,
    sessionId?: string,
  ): Promise<void> {
    const messages = {
      ADMIN_LOGIN: 'Admin user logged in',
      ADMIN_LOGOUT: 'Admin user logged out',
      SESSION_REVOKED: 'Admin session was revoked',
    };

    await this.activityLogQuery.create({
      activityType,
      message: messages[activityType],
      entityType: 'session',
      entityId: adminUserId,
      entityLabel: `Admin User #${adminUserId}`,
      adminUserId,
      metadata: sessionId ? { sessionId } : null,
    });
  }

  /**
   * Generic method to log any activity
   * Use this for custom activity types
   */
  async logActivity(input: ActivityLogCreateInput, trx?: Knex.Transaction): Promise<void> {
    if (trx) {
      await this.activityLogQuery.createInTransaction(trx, input);
    } else {
      await this.activityLogQuery.create(input);
    }
  }
}
