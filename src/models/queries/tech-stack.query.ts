import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';

/**
 * Tech stack item interface
 */
export interface TechStackItem {
  id: number;
  name: string;
  category: string;
  iconUrl?: string;
}

/**
 * Tech stack grouped by category
 */
export interface TechStackGrouped {
  [category: string]: TechStackItem[];
}

/**
 * Query layer for tech stack operations
 * Handles ALL database operations for tech_stack table
 * NO business logic - pure database access
 */
@Injectable()
export class TechStackQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.tech_stack';
  }

  /**
   * Map database row to tech stack item
   * Transforms snake_case DB columns to camelCase
   */
  protected mapToTechStackItem(row: any): TechStackItem {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      iconUrl: row.icon_url || undefined,
    };
  }

  /**
   * Fetch all tech stack items
   * Returns array of all tech stack items
   */
  async findAll(): Promise<TechStackItem[]> {
    const rows = await this.knex(this.getTableName())
      .select('id', 'name', 'category', 'icon_url')
      .orderBy('category', 'asc')
      .orderBy('name', 'asc');

    return rows.map((row) => this.mapToTechStackItem(row));
  }

  /**
   * Fetch all tech stack items grouped by category
   * Returns object with category keys and arrays of tech stack items
   */
  async findAllGroupedByCategory(): Promise<TechStackGrouped> {
    const items = await this.findAll();

    // Group by category
    const grouped: TechStackGrouped = {};
    for (const item of items) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }

    return grouped;
  }

  /**
   * Validate that tech stack IDs exist
   * Returns array of valid IDs
   */
  async validateTechStackIds(techStackIds: number[]): Promise<number[]> {
    if (!techStackIds || techStackIds.length === 0) {
      return [];
    }

    const existing = await this.knex(this.getTableName())
      .whereIn('id', techStackIds)
      .select('id');

    return existing.map((row) => row.id);
  }
}
