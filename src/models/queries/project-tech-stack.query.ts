import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';

/**
 * Query layer for project-tech-stack junction table operations
 * Handles ALL database operations for project-tech_stack relationships
 * NO business logic - pure database access
 */
@Injectable()
export class ProjectTechStackQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.project_tech_stack';
  }

  /**
   * Get all tech stack IDs for a project
   * Returns array of tech_stack_id values
   */
  async getTechStackIdsByProjectId(projectId: number): Promise<number[]> {
    const rows = await this.knex(this.getTableName())
      .where({ project_id: projectId })
      .select('tech_stack_id');

    return rows.map((row) => row.tech_stack_id);
  }

  /**
   * Delete all tech stack associations for a project
   * Used when syncing tech stack during update
   */
  async deleteByProjectId(trx: Knex.Transaction, projectId: number): Promise<void> {
    await trx(this.getTableName()).where({ project_id: projectId }).delete();
  }

  /**
   * Insert tech stack associations for a project
   * Creates junction records linking project to tech stack items
   */
  async insertTechStackAssociations(
    trx: Knex.Transaction,
    projectId: number,
    techStackIds: number[],
  ): Promise<void> {
    if (!techStackIds || techStackIds.length === 0) {
      return;
    }

    // Validate that all tech stack IDs exist
    const existingTechStack = await trx('data.tech_stack')
      .whereIn('id', techStackIds)
      .select('id');

    const existingIds = existingTechStack.map((ts) => ts.id);
    const missingIds = techStackIds.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new BadRequestException({
        success: false,
        code: 'VALIDATION_ERROR',
        message: `Tech stack IDs not found: ${missingIds.join(', ')}. Please use valid tech stack IDs.`,
        errors: [
          {
            field: 'techStackIds',
            message: `The following tech stack IDs do not exist: ${missingIds.join(', ')}`,
            code: 'INVALID_TECH_STACK_IDS',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // Insert junction records
    const junctionData = techStackIds.map((techStackId) => ({
      project_id: projectId,
      tech_stack_id: techStackId,
      created_at: new Date(),
    }));

    await trx(this.getTableName()).insert(junctionData);
  }

  /**
   * Sync tech stack associations for a project
   * Deletes existing associations and inserts new ones in a single transaction
   */
  async syncTechStack(
    trx: Knex.Transaction,
    projectId: number,
    techStackIds: number[],
  ): Promise<void> {
    // Delete existing associations
    await this.deleteByProjectId(trx, projectId);

    // Insert new associations
    await this.insertTechStackAssociations(trx, projectId, techStackIds);
  }
}
