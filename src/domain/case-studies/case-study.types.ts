import { BaseEntity, BaseCreateInput, BaseUpdateInput, BaseQueryOptions } from '../shared/base.contract';

export interface CaseStudy extends BaseEntity {
  title: string;
  description: string;
  slug: string;
  content: string;
  projectId?: string;
  imageUrl?: string;
  published: boolean;
}

export interface CaseStudyCreateInput extends BaseCreateInput {
  title: string;
  description: string;
  slug: string;
  content: string;
  projectId?: string;
  imageUrl?: string;
  published?: boolean;
}

export interface CaseStudyUpdateInput extends BaseUpdateInput {
  title?: string;
  description?: string;
  slug?: string;
  content?: string;
  projectId?: string;
  imageUrl?: string;
  published?: boolean;
}

export interface CaseStudyQueryOptions extends BaseQueryOptions {
  published?: boolean;
  projectId?: string;
  search?: string;
}

