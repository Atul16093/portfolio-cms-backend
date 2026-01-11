import { Project, ProjectCreateInput, ProjectUpdateInput, ProjectQueryOptions } from './project.types';

export interface IProjectRepository {
  findAll(options?: ProjectQueryOptions): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  create(input: ProjectCreateInput): Promise<Project>;
  update(id: string, input: ProjectUpdateInput): Promise<Project>;
  delete(id: string): Promise<void>;
  count(options?: ProjectQueryOptions): Promise<number>;
}

