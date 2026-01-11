import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { CaseStudy, CaseStudyCreateInput, CaseStudyUpdateInput, CaseStudyQueryOptions } from '../../domain/case-studies/case-study.types';
import { ICaseStudyRepository } from '../../domain/case-studies/case-study.contract';

@Injectable()
export class CaseStudyQuery extends BaseQuery implements ICaseStudyRepository {
  protected getTableName(): string {
    return 'case_studies';
  }

  protected mapToEntity(row: any): CaseStudy {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      slug: row.slug,
      content: row.content,
      projectId: row.project_id,
      imageUrl: row.image_url,
      published: row.published || false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(options?: CaseStudyQueryOptions): Promise<CaseStudy[]> {
    let query = this.knex(this.getTableName());

    if (options?.published !== undefined) {
      query = query.where('published', options.published);
    }

    if (options?.projectId) {
      query = query.where('project_id', options.projectId);
    }

    if (options?.search) {
      query = query.where((builder) => {
        builder
          .where('title', 'ilike', `%${options.search}%`)
          .orWhere('description', 'ilike', `%${options.search}%`);
      });
    }

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDirection || 'asc');
    } else {
      query = query.orderBy('created_at', 'desc');
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;
    return this.mapToEntities(rows);
  }

  async findById(id: string): Promise<CaseStudy | null> {
    const row = await this.knex(this.getTableName()).where({ id }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<CaseStudy | null> {
    const row = await this.knex(this.getTableName()).where({ slug }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async create(input: CaseStudyCreateInput): Promise<CaseStudy> {
    const now = new Date();
    const insertData = {
      id: this.generateId(),
      title: input.title,
      description: input.description,
      slug: input.slug,
      content: input.content,
      project_id: input.projectId,
      image_url: input.imageUrl,
      published: input.published || false,
      created_at: now,
      updated_at: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  async update(id: string, input: CaseStudyUpdateInput): Promise<CaseStudy> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.projectId !== undefined) updateData.project_id = input.projectId;
    if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
    if (input.published !== undefined) updateData.published = input.published;

    const [row] = await this.knex(this.getTableName())
      .where({ id })
      .update(updateData)
      .returning('*');

    return row ? this.mapToEntity(row) : null;
  }

  async delete(id: string): Promise<void> {
    await this.knex(this.getTableName()).where({ id }).delete();
  }

  async count(options?: CaseStudyQueryOptions): Promise<number> {
    let query = this.knex(this.getTableName());

    if (options?.published !== undefined) {
      query = query.where('published', options.published);
    }

    if (options?.projectId) {
      query = query.where('project_id', options.projectId);
    }

    if (options?.search) {
      query = query.where((builder) => {
        builder
          .where('title', 'ilike', `%${options.search}%`)
          .orWhere('description', 'ilike', `%${options.search}%`);
      });
    }

    const result = await query.count('* as count').first();
    return parseInt(result?.count as string || '0', 10);
  }
}

