import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';
import { CreateProjectDto } from '../../dtos/projects/create-project.dto';
import { UpdateProjectDto } from '../../dtos/projects/update-project.dto';
import {
  ProjectResponseDto,
  ProjectTechStackDto,
  ProjectListItemDto,
  ProjectEditDto,
} from '../../dtos/projects/project-response.dto';

/**
 * Query layer for CMS project operations
 * Handles ALL database operations using Knex - NO business logic
 * Uses transactions where required for data consistency
 */
@Injectable()
export class ProjectsQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.projects';
  }

  /**
   * Map database row to project entity with tech stack
   * Transforms snake_case DB columns to camelCase DTO format
   * Handles tech_stack as either JSON string (from raw query) or object (from JSON aggregation)
   */
  protected mapToProjectEntity(row: any): ProjectResponseDto {
    // Handle tech_stack: may be string (JSON) or already parsed object/array from JSON_AGG
    let techStack: ProjectTechStackDto[] = [];
    if (row.tech_stack) {
      if (typeof row.tech_stack === 'string') {
        techStack = JSON.parse(row.tech_stack);
      } else {
        techStack = row.tech_stack;
      }
    }

    return {
      id: row.id,
      uuid: row.uuid,
      title: row.title,
      slug: row.slug,
      summary: row.summary || null,
      isFeatured: row.is_featured || false,
      status: row.status || 'active',
      techStack,
      createdAt: row.created_at,
    };
  }

  /**
   * Insert a new project into data.projects table
   * Returns the created project without tech stack (attach separately)
   */
  async insertProject(trx: Knex.Transaction, input: CreateProjectDto): Promise<any> {
    const now = new Date();
    const insertData = {
      title: input.title,
      slug: input.slug,
      summary: input.summary || null,
      is_featured: input.isFeatured ?? false,
      status: input.status || 'active',
      created_at: now,
      updated_at: now,
    };

    const [row] = await trx(this.getTableName())
      .insert(insertData)
      .returning('*');

    return row;
  }

  /**
   * Attach tech stack to a project via data.project_tech_stack junction table
   * Inserts multiple records for all tech stack IDs provided
   * Throws BadRequestException if tech stack IDs don't exist
   */
  async attachTechStack(trx: Knex.Transaction, projectId: number, techStackIds: number[]): Promise<void> {
    if (!techStackIds || techStackIds.length === 0) {
      return;
    }

    // Validate that all tech stack IDs exist before inserting
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

    await trx('data.project_tech_stack').insert(junctionData);
  }

  /**
   * Fetch all projects with aggregated tech stack using JSON aggregation
   * Uses LEFT JOIN and JSON aggregation to include tech stack in single query
   */
  async findAllWithTechStack(options?: { limit?: number; offset?: number }): Promise<ProjectResponseDto[]> {
    let query = this.knex(this.getTableName())
      .select(
        'data.projects.id',
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
        // Aggregate tech stack as JSON array using PostgreSQL JSON functions
        this.knex.raw(
          `COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ts.id,
                'name', ts.name,
                'category', ts.category,
                'iconUrl', ts.icon_url
              )
            ) FILTER (WHERE ts.id IS NOT NULL),
            '[]'::json
          ) as tech_stack`
        ),
      )
      .leftJoin('data.project_tech_stack as pts', 'data.projects.id', 'pts.project_id')
      .leftJoin('data.tech_stack as ts', 'pts.tech_stack_id', 'ts.id')
      .groupBy(
        'data.projects.id',
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
      )
      .orderBy('data.projects.created_at', 'desc');

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;
    return rows.map((row) => this.mapToProjectEntity(row));
  }

  /**
   * Fetch a single project by ID with aggregated tech stack
   * Uses same JSON aggregation pattern as findAllWithTechStack for consistency
   */
  async findByIdWithTechStack(id: number): Promise<ProjectResponseDto | null> {
    const [row] = await this.knex(this.getTableName())
      .select(
        'data.projects.id',
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
        // Aggregate tech stack as JSON array using PostgreSQL JSON functions
        this.knex.raw(
          `COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ts.id,
                'name', ts.name,
                'category', ts.category,
                'iconUrl', ts.icon_url
              )
            ) FILTER (WHERE ts.id IS NOT NULL),
            '[]'::json
          ) as tech_stack`
        ),
      )
      .leftJoin('data.project_tech_stack as pts', 'data.projects.id', 'pts.project_id')
      .leftJoin('data.tech_stack as ts', 'pts.tech_stack_id', 'ts.id')
      .where('data.projects.id', id)
      .groupBy(
        'data.projects.id',
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
      )
      .limit(1);

    return row ? this.mapToProjectEntity(row) : null;
  }

  /**
   * Check if a project with the given slug already exists
   * Used for validation to prevent duplicate slugs
   */
  async findBySlug(slug: string): Promise<any | null> {
    const row = await this.knex(this.getTableName()).where({ slug }).first();
    return row || null;
  }

  /**
   * Find project by UUID
   * Returns raw database row
   */
  async findByUuid(uuid: string): Promise<any | null> {
    const row = await this.knex(this.getTableName()).where({ uuid }).first();
    return row || null;
  }

  /**
   * Fetch all projects for CMS list view
   * Includes updated_at and simplified tech stack, ordered by updated_at desc
   */
  async findAllForList(options?: { limit?: number; offset?: number }): Promise<ProjectListItemDto[]> {
    let query = this.knex(this.getTableName())
      .select(
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.updated_at',
        // Aggregate tech stack as JSON array (simplified format)
        this.knex.raw(
          `COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ts.id,
                'name', ts.name,
                'iconUrl', ts.icon_url
              )
            ) FILTER (WHERE ts.id IS NOT NULL),
            '[]'::json
          ) as tech_stack`
        ),
      )
      .leftJoin('data.project_tech_stack as pts', 'data.projects.id', 'pts.project_id')
      .leftJoin('data.tech_stack as ts', 'pts.tech_stack_id', 'ts.id')
      .groupBy(
        'data.projects.id',
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.updated_at',
      )
      .orderBy('data.projects.updated_at', 'desc');

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;
    return rows.map((row) => ({
      uuid: row.uuid,
      title: row.title,
      slug: row.slug,
      isFeatured: row.is_featured || false,
      status: row.status || 'active',
      updatedAt: row.updated_at,
      techStack: row.tech_stack ? (typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack) : [],
    }));
  }

  /**
   * Fetch project for edit page by UUID
   * Returns project with tech_stack_ids array instead of full tech stack objects
   * Note: techStackIds should be fetched separately using ProjectTechStackQuery
   */
  async findForEdit(uuid: string): Promise<Omit<ProjectEditDto, 'techStackIds'> | null> {
    const row = await this.knex(this.getTableName()).where({ uuid }).first();

    if (!row) {
      return null;
    }

    return {
      uuid: row.uuid,
      title: row.title,
      slug: row.slug,
      summary: row.summary || null,
      isFeatured: row.is_featured || false,
      status: row.status || 'active',
    };
  }

  /**
   * Update project in database
   * Returns updated project row
   */
  async updateProject(trx: Knex.Transaction, uuid: string, input: UpdateProjectDto): Promise<any> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.summary !== undefined) updateData.summary = input.summary;
    if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;
    if (input.status !== undefined) updateData.status = input.status;

    const [row] = await trx(this.getTableName())
      .where({ uuid })
      .update(updateData)
      .returning('*');

    return row;
  }

  /**
   * Toggle featured status for a project
   * Returns updated project row
   */
  async toggleFeatured(uuid: string): Promise<any> {
    // Get current featured status
    const current = await this.knex(this.getTableName()).where({ uuid }).first();
    if (!current) {
      return null;
    }

    const [row] = await this.knex(this.getTableName())
      .where({ uuid })
      .update({
        is_featured: !current.is_featured,
        updated_at: new Date(),
      })
      .returning('*');

    return row;
  }
}
