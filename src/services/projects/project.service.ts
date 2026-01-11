import { Injectable } from '@nestjs/common';
import { ProjectQuery } from '../../models/queries/project.query';
import { Project, ProjectCreateInput, ProjectUpdateInput, ProjectQueryOptions } from '../../domain/projects/project.types';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';
import { ResponseService } from '../../core/response-management';

@Injectable()
export class ProjectService {
  constructor(
    private projectQuery: ProjectQuery,
    private responseService: ResponseService,
  ) {}

  async findAll(options?: ProjectQueryOptions): Promise<Project[]> {
    return this.projectQuery.findAll(options);
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectQuery.findById(id);
    if (!project) {
      throw new ResourceNotFoundException('Project', `id: ${id}`);
    }
    return project;
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectQuery.findBySlug(slug);
    if (!project) {
      throw new ResourceNotFoundException('Project', `slug: ${slug}`);
    }
    return project;
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    // Business logic: Check if slug already exists
    const existing = await this.projectQuery.findBySlug(input.slug);
    if (existing) {
      throw this.responseService.conflict('Project with this slug already exists');
    }

    return this.projectQuery.create(input);
  }

  async update(id: string, input: ProjectUpdateInput): Promise<Project> {
    // Business logic: Verify project exists
    const existing = await this.projectQuery.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Project', `id: ${id}`);
    }

    // Business logic: Check slug uniqueness if slug is being updated
    if (input.slug && input.slug !== existing.slug) {
      const slugExists = await this.projectQuery.findBySlug(input.slug);
      if (slugExists) {
        throw this.responseService.conflict('Project with this slug already exists');
      }
    }

    return this.projectQuery.update(id, input);
  }

  async delete(id: string): Promise<void> {
    // Business logic: Verify project exists
    const existing = await this.projectQuery.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Project', `id: ${id}`);
    }

    await this.projectQuery.delete(id);
  }

  async count(options?: ProjectQueryOptions): Promise<number> {
    return this.projectQuery.count(options);
  }
}

