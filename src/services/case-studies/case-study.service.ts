import { Injectable } from '@nestjs/common';
import { CaseStudyQuery } from '../../models/queries/case-study.query';
import { CaseStudy, CaseStudyCreateInput, CaseStudyUpdateInput, CaseStudyQueryOptions } from '../../domain/case-studies/case-study.types';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';
import { ResponseService } from '../../core/response-management';

@Injectable()
export class CaseStudyService {
  constructor(
    private caseStudyQuery: CaseStudyQuery,
    private responseService: ResponseService,
  ) {}

  async findAll(options?: CaseStudyQueryOptions): Promise<CaseStudy[]> {
    return this.caseStudyQuery.findAll(options);
  }

  async findById(id: string): Promise<CaseStudy> {
    const caseStudy = await this.caseStudyQuery.findById(id);
    if (!caseStudy) {
      throw new ResourceNotFoundException('Case Study', `id: ${id}`);
    }
    return caseStudy;
  }

  async findBySlug(slug: string): Promise<CaseStudy> {
    const caseStudy = await this.caseStudyQuery.findBySlug(slug);
    if (!caseStudy) {
      throw new ResourceNotFoundException('Case Study', `slug: ${slug}`);
    }
    return caseStudy;
  }

  async create(input: CaseStudyCreateInput): Promise<CaseStudy> {
    // Business logic: Check if slug already exists
    const existing = await this.caseStudyQuery.findBySlug(input.slug);
    if (existing) {
      throw this.responseService.conflict('Case study with this slug already exists');
    }

    return this.caseStudyQuery.create(input);
  }

  async update(id: string, input: CaseStudyUpdateInput): Promise<CaseStudy> {
    // Business logic: Verify case study exists
    const existing = await this.caseStudyQuery.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Case Study', `id: ${id}`);
    }

    // Business logic: Check slug uniqueness if slug is being updated
    if (input.slug && input.slug !== existing.slug) {
      const slugExists = await this.caseStudyQuery.findBySlug(input.slug);
      if (slugExists) {
        throw this.responseService.conflict('Case study with this slug already exists');
      }
    }

    return this.caseStudyQuery.update(id, input);
  }

  async delete(id: string): Promise<void> {
    // Business logic: Verify case study exists
    const existing = await this.caseStudyQuery.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Case Study', `id: ${id}`);
    }

    await this.caseStudyQuery.delete(id);
  }

  async count(options?: CaseStudyQueryOptions): Promise<number> {
    return this.caseStudyQuery.count(options);
  }
}

