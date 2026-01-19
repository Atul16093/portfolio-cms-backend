import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';

/**
 * Activity log entry interface
 */
export interface ActivityLogEntry {
  id: number;
  uuid: string;
  activityType: string;
  message: string;
  entityType: string | null;
  entityId: number | null;
  entityLabel: string | null;
  adminUserId: number | null;
  metadata: any | null;
  createdAt: Date;
}

/**
 * Activity log creation input
 */
export interface ActivityLogCreateInput {
  activityType: string;
  message: string;
  entityType?: string;
  entityId?: number;
  entityLabel?: string;
  adminUserId?: number;
  metadata?: any;
}

/**
 * Query layer for activity_logs table operations
 * Handles ALL database operations for activity logging - NO business logic
 */
@Injectable()
export class ActivityLogQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.activity_logs';
  }

  /**
   * Map database row to activity log entity
   * Transforms snake_case DB columns to camelCase
   */
  protected mapToEntity(row: any): ActivityLogEntry {
    return {
      id: row.id,
      uuid: row.uuid,
      activityType: row.activity_type,
      message: row.message,
      entityType: row.entity_type,
      entityId: row.entity_id,
      entityLabel: row.entity_label,
      adminUserId: row.admin_user_id,
      metadata: row.metadata,
      createdAt: row.created_at,
    };
  }

  /**
   * Create a new activity log entry
   * Used to track user actions and system events
   */
  async create(input: ActivityLogCreateInput): Promise<ActivityLogEntry> {
    const insertData = {
      activity_type: input.activityType,
      message: input.message,
      entity_type: input.entityType || null,
      entity_id: input.entityId || null,
      entity_label: input.entityLabel || null,
      admin_user_id: input.adminUserId || null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      created_at: new Date(),
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  /**
   * Create activity log entry within a transaction
   * Used when logging activities as part of other operations
   */
  async createInTransaction(trx: Knex.Transaction, input: ActivityLogCreateInput): Promise<ActivityLogEntry> {
    const insertData = {
      activity_type: input.activityType,
      message: input.message,
      entity_type: input.entityType || null,
      entity_id: input.entityId || null,
      entity_label: input.entityLabel || null,
      admin_user_id: input.adminUserId || null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      created_at: new Date(),
    };

    const [row] = await trx(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  /**
   * Get recent activity logs
   * Returns most recent activities ordered by created_at DESC
   */
  async getRecent(limit: number): Promise<ActivityLogEntry[]> {
    const rows = await this.knex(this.getTableName())
      .orderBy('created_at', 'desc')
      .limit(limit);

    return this.mapToEntities(rows);
  }

  /**
   * Get activity logs by activity type
   */
  async getByActivityType(activityType: string, limit: number): Promise<ActivityLogEntry[]> {
    const rows = await this.knex(this.getTableName())
      .where('activity_type', activityType)
      .orderBy('created_at', 'desc')
      .limit(limit);

    return this.mapToEntities(rows);
  }

  /**
   * Get activity logs by admin user
   */
  async getByAdminUserId(adminUserId: number, limit: number): Promise<ActivityLogEntry[]> {
    const rows = await this.knex(this.getTableName())
      .where('admin_user_id', adminUserId)
      .orderBy('created_at', 'desc')
      .limit(limit);

    return this.mapToEntities(rows);
  }
}
