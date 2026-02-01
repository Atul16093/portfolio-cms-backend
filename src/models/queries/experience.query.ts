import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { CreateExperienceDto } from '../../dtos/experience/create-experience.dto';
import { UpdateExperienceDto } from '../../dtos/experience/update-experience.dto';

/**
 * Query layer for experience operations
 * Handles ALL database operations using Knex - NO business logic
 * Table: data.experience
 */
@Injectable()
export class ExperienceQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.experience';
  }

  /**
   * DB column `description` is jsonb in current schema.
   * We store a plain text description as a JSON string for compatibility.
   */
  private toJsonbText(value: string): string {
    return JSON.stringify(value);
  }

  /**
   * Map database row to experience entity
   * Transforms snake_case DB columns to camelCase format
   * Formats date fields to YYYY-MM-DD string format
   */
  protected mapToEntity(row: any): any {
    // Format dates to YYYY-MM-DD string format
    const formatDate = (date: any): string | null => {
      if (!date) return null;
      if (typeof date === 'string') {
        // If already a string, extract just the date part (YYYY-MM-DD)
        return date.split('T')[0];
      }
      if (date instanceof Date) {
        // Format Date object to YYYY-MM-DD
        return date.toISOString().split('T')[0];
      }
      return null;
    };

    // Frontend receives `id` as the UUID value; numeric id never exposed.
    return {
      id: row.uuid,
      company: row.company,
      role: row.role,
      start_date: formatDate(row.start_date),
      end_date: formatDate(row.end_date),
      // If jsonb comes back as string, keep it; if object, stringify.
      description:
        row.description == null
          ? null
          : typeof row.description === 'string'
            ? row.description
            : JSON.stringify(row.description),
      order_index: row.order_index,
      is_visible: row.is_visible,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * Get all experiences ordered by order_index ASC
   * Returns all rows (no pagination)
   */
  async getAll(): Promise<any[]> {
    const rows = await this.knex(this.getTableName())
      .orderBy('order_index', 'asc')
      .select('*');

    return this.mapToEntities(rows);
  }

  /**
   * Create a new experience
   * Returns the created experience
   */
  async create(input: CreateExperienceDto): Promise<any> {
    const now = new Date();
    const insertData = {
      company: input.company,
      role: input.role,
      start_date: input.start_date,
      end_date: input.end_date || null,
      description: this.toJsonbText(input.description),
      order_index: input.order_index,
      is_visible: input.is_visible ?? true,
      created_at: now,
      updated_at: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  /**
   * Find experience by UUID (id in response is uuid; we look up by uuid internally)
   */
  async findByUuid(uuid: string): Promise<any | null> {
    const row = await this.knex(this.getTableName()).where({ uuid }).first();
    return row ? this.mapToEntity(row) : null;
  }

  /**
   * Update experience by UUID
   */
  async updateByUuid(uuid: string, input: UpdateExperienceDto): Promise<any | null> {
    const updateData = {
      company: input.company,
      role: input.role,
      start_date: input.start_date,
      end_date: input.end_date || null,
      description: this.toJsonbText(input.description),
      order_index: input.order_index,
      is_visible: input.is_visible,
      updated_at: new Date(),
    };

    const [row] = await this.knex(this.getTableName())
      .where({ uuid })
      .update(updateData)
      .returning('*');

    return row ? this.mapToEntity(row) : null;
  }

  /**
   * Update visibility by UUID
   */
  async updateVisibilityByUuid(uuid: string, isVisible: boolean): Promise<any | null> {
    const [row] = await this.knex(this.getTableName())
      .where({ uuid })
      .update({
        is_visible: isVisible,
        updated_at: new Date(),
      })
      .returning('*');

    return row ? this.mapToEntity(row) : null;
  }

  /**
   * Delete experience by UUID (hard delete)
   */
  async deleteByUuid(uuid: string): Promise<void> {
    await this.knex(this.getTableName()).where({ uuid }).delete();
  }
}
