import { CaseStudy, CaseStudyCreateInput, CaseStudyUpdateInput, CaseStudyQueryOptions } from './case-study.types';

export interface ICaseStudyRepository {
  findAll(options?: CaseStudyQueryOptions): Promise<CaseStudy[]>;
  findById(id: string): Promise<CaseStudy | null>;
  findBySlug(slug: string): Promise<CaseStudy | null>;
  create(input: CaseStudyCreateInput): Promise<CaseStudy>;
  update(id: string, input: CaseStudyUpdateInput): Promise<CaseStudy>;
  delete(id: string): Promise<void>;
  count(options?: CaseStudyQueryOptions): Promise<number>;
}

