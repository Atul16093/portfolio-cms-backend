import { Injectable } from '@nestjs/common';
import { BaseQuery } from '../base.query';
import { PublicProjectResponseDto } from '../../../dtos/public/public-project.dto';

@Injectable()
export class PublicProjectsQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.projects';
  }

  /**
   * Find all active projects for public list
   * Featured projects first
   * Lightweight: id (uuid), title, slug, summary, is_featured, tech_stack (simplified)
   */
  async findAllActive(): Promise<PublicProjectResponseDto[]> {
    const rows = await this.knex(this.getTableName())
      .select(
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
        // Aggregate tech stack as JSON array
        this.knex.raw(
          `COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ts.uuid,
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
      .where('data.projects.status', 'active')
      .groupBy(
        'data.projects.id', // Still group by ID for uniqueness, but don't select it
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
      )
      .orderBy('data.projects.is_featured', 'desc')
      .orderBy('data.projects.created_at', 'desc');

    return rows.map(row => this.mapToProjectEntity(row));
  }

  /**
   * Find project by slug (active only)
   * Include full tech stack details
   */
  async findBySlug(slug: string): Promise<PublicProjectResponseDto | null> {
    const [row] = await this.knex(this.getTableName())
      .select(
        'data.projects.uuid',
        'data.projects.title',
        'data.projects.slug',
        'data.projects.summary',
        'data.projects.is_featured',
        'data.projects.status',
        'data.projects.created_at',
        this.knex.raw(
          `COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ts.uuid,
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
      .where('data.projects.slug', slug)
      .andWhere('data.projects.status', 'active')
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

  protected mapToProjectEntity(row: any): PublicProjectResponseDto {
    let techStack = [];
    if (row.tech_stack) {
      techStack = typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack;
    }

    return {
      id: row.uuid,
      title: row.title,
      slug: row.slug,
      summary: row.summary || null,
      isFeatured: row.is_featured || false,
      status: row.status || 'active',
      techStack,
      createdAt: row.created_at,
    };
  }
}
