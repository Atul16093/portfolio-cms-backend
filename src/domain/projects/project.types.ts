import { BaseEntity, BaseCreateInput, BaseUpdateInput, BaseQueryOptions } from '../shared/base.contract';

export interface Project extends BaseEntity {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured: boolean;
  published: boolean;
}

export interface ProjectCreateInput extends BaseCreateInput {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
}

export interface ProjectUpdateInput extends BaseUpdateInput {
  title?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
}

export interface ProjectQueryOptions extends BaseQueryOptions {
  featured?: boolean;
  published?: boolean;
  search?: string;
}

