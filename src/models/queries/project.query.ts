import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Project, ProjectCreateInput, ProjectUpdateInput, ProjectQueryOptions } from '../../domain/projects/project.types';
import { IProjectRepository } from '../../domain/projects/project.contract';

@Injectable()
export class ProjectQuery extends BaseQuery implements IProjectRepository {
  protected getTableName(): string {
    return 'projects';
  }

  protected mapToEntity(row: any): Project {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      slug: row.slug,
      imageUrl: row.image_url,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      techStack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
      featured: row.featured || false,
      published: row.published || false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(options?: ProjectQueryOptions): Promise<Project[]> {
    let query = this.knex(this.getTableName());

    if (options?.featured !== undefined) {
      query = query.where('featured', options.featured);
    }

    if (options?.published !== undefined) {
      query = query.where('published', options.published);
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

  async findById(id: string): Promise<Project | null> {
    const row = await this.knex(this.getTableName()).where({ id }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const row = await this.knex(this.getTableName()).where({ slug }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const now = new Date();
    const insertData = {
      id: this.generateId(),
      title: input.title,
      description: input.description,
      slug: input.slug,
      image_url: input.imageUrl,
      github_url: input.githubUrl,
      live_url: input.liveUrl,
      tech_stack: input.techStack ? JSON.stringify(input.techStack) : null,
      featured: input.featured || false,
      published: input.published || false,
      created_at: now,
      updated_at: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  async update(id: string, input: ProjectUpdateInput): Promise<Project> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
    if (input.githubUrl !== undefined) updateData.github_url = input.githubUrl;
    if (input.liveUrl !== undefined) updateData.live_url = input.liveUrl;
    if (input.techStack !== undefined) updateData.tech_stack = JSON.stringify(input.techStack);
    if (input.featured !== undefined) updateData.featured = input.featured;
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

  async count(options?: ProjectQueryOptions): Promise<number> {
    let query = this.knex(this.getTableName());

    if (options?.featured !== undefined) {
      query = query.where('featured', options.featured);
    }

    if (options?.published !== undefined) {
      query = query.where('published', options.published);
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

