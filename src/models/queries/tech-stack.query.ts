import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';
import { CreateTechStackDto } from '../../dtos/tech-stack/create-tech-stack.dto';
import { UpdateTechStackDto } from '../../dtos/tech-stack/update-tech-stack.dto';

/**
 * Tech stack item (for grouped list)
 */
export interface TechStackItem {
  id: number;
  name: string;
  category: string;
  icon_url: string | null;
  priority: number;
  is_visible: boolean;
}

/**
 * Tech stack grouped by category (used by GET /cms/tech-stack)
 */
export interface TechStackGrouped {
  [category: string]: TechStackItem[];
}

/** Legacy shape for project-edit dropdown (id, name, category, iconUrl) */
export type TechStackGroupedLegacy = Record<string, { id: number; name: string; category: string; iconUrl?: string }[]>;

/**
 * Query layer for tech stack operations
 * Handles ALL database operations for tech_stack table. NO business logic.
 */
@Injectable()
export class TechStackQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.tech_stack';
  }

  /**
   * Map row to tech stack item (snake_case kept for API contract)
   */
  protected mapToItem(row: any): TechStackItem {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      icon_url: row.icon_url ?? null,
      priority: row.priority ?? 0,
      is_visible: row.is_visible ?? true,
    };
  }

  /**
   * Get tech stack grouped by category, visible only by default, sorted by priority ASC
   */
  async getGroupedVisible(visibleOnly: boolean = true): Promise<TechStackGrouped> {
    let q = this.knex(this.getTableName())
      .select('id', 'name', 'category', 'icon_url', 'priority', 'is_visible')
      .orderBy('category', 'asc')
      .orderBy('priority', 'asc');

    if (visibleOnly) {
      q = q.where('is_visible', true);
    }

    const rows = await q;
    const grouped: TechStackGrouped = {};
    for (const row of rows) {
      const item = this.mapToItem(row);
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }
    return grouped;
  }

  /**
   * Create a tech stack item
   */
  async create(input: CreateTechStackDto): Promise<TechStackItem> {
    const insertData = {
      name: input.name,
      category: input.category,
      icon_url: input.icon_url || null,
      priority: input.priority ?? 0,
      is_visible: true,
    };
    const [row] = await this.knex(this.getTableName()).insert(insertData).returning('*');
    return this.mapToItem(row);
  }

  /**
   * Update tech stack by id
   */
  async updateById(id: number, input: UpdateTechStackDto): Promise<TechStackItem | null> {
    const updateData = {
      name: input.name,
      category: input.category,
      icon_url: input.icon_url || null,
      priority: input.priority,
      is_visible: input.is_visible,
      updated_at: new Date(),
    };
    const [row] = await this.knex(this.getTableName())
      .where({ id })
      .update(updateData)
      .returning('*');
    return row ? this.mapToItem(row) : null;
  }

  /**
   * Update visibility by id
   */
  async updateVisibility(id: number, isVisible: boolean): Promise<TechStackItem | null> {
    const [row] = await this.knex(this.getTableName())
      .where({ id })
      .update({ is_visible: isVisible, updated_at: new Date() })
      .returning('*');
    return row ? this.mapToItem(row) : null;
  }

  /**
   * Batch update priorities (caller runs in transaction)
   */
  async reorderBatch(trx: Knex.Transaction, items: { id: number; priority: number }[]): Promise<void> {
    const table = trx(this.getTableName());
    for (const { id, priority } of items) {
      await table.where({ id }).update({ priority, updated_at: new Date() });
    }
  }

  /**
   * Delete tech stack row only if not referenced in project_tech_stack.
   * Returns number of rows deleted (0 or 1).
   */
  async deleteIfUnused(id: number): Promise<number> {
    const sub = this.knex('data.project_tech_stack').select(this.knex.raw(1)).where('tech_stack_id', id);
    const deleted = await this.knex(this.getTableName()).where({ id }).whereNotExists(sub).delete();
    return typeof deleted === 'number' ? deleted : 0;
  }

  /**
   * Find by id
   */
  async findById(id: number): Promise<TechStackItem | null> {
    const row = await this.knex(this.getTableName()).where({ id }).first();
    return row ? this.mapToItem(row) : null;
  }

  /**
   * Find by name (for uniqueness check)
   */
  async findByName(name: string): Promise<{ id: number } | null> {
    const row = await this.knex(this.getTableName()).where({ name }).first('id');
    return row ?? null;
  }

  /**
   * Validate that tech stack IDs exist
   * Returns array of valid IDs
   */
  async validateTechStackIds(techStackIds: number[]): Promise<number[]> {
    if (!techStackIds || techStackIds.length === 0) {
      return [];
    }
    const existing = await this.knex(this.getTableName()).whereIn('id', techStackIds).select('id');
    return existing.map((r) => r.id);
  }

  /**
   * Fetch all tech stack items grouped by category (kept for CmsProjectsService project-edit dropdown)
   */
  async findAllGroupedByCategory(): Promise<TechStackGroupedLegacy> {
    const rows = await this.knex(this.getTableName())
      .select('id', 'name', 'category', 'icon_url')
      .orderBy('category', 'asc')
      .orderBy('name', 'asc');
    const grouped: TechStackGroupedLegacy = {};
    for (const row of rows) {
      const item = { id: row.id, name: row.name, category: row.category, iconUrl: row.icon_url || undefined };
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }
    return grouped;
  }
}
