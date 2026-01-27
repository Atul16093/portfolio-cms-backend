import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExperienceQuery } from '../../models/queries/experience.query';
import { CreateExperienceDto } from '../../dtos/experience/create-experience.dto';
import { UpdateExperienceDto } from '../../dtos/experience/update-experience.dto';
import { ToggleVisibilityDto } from '../../dtos/experience/toggle-visibility.dto';

/**
 * Service layer for CMS experience operations
 * Contains business logic and orchestration - NO database queries directly
 * Uses query layer for all database operations
 */
@Injectable()
export class CmsExperienceService {
  constructor(private experienceQuery: ExperienceQuery) {}

  /**
   * Get all experiences ordered by order_index ASC
   * Business logic: None - simply delegates to query layer
   */
  async findAll(): Promise<any[]> {
    return this.experienceQuery.getAll();
  }

  /**
   * Get a single experience by id (id is uuid; numeric id not exposed)
   */
  async findOne(id: string): Promise<any> {
    const experience = await this.experienceQuery.findByUuid(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  /**
   * Create a new experience
   * Business logic:
   * - Date validation is handled by Zod schema
   * - Delegates to query layer for insertion
   */
  async create(input: CreateExperienceDto): Promise<any> {
    // Business logic: Additional date validation (redundant but explicit)
    if (input.end_date && new Date(input.start_date) >= new Date(input.end_date)) {
      throw new BadRequestException({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Start date must be before end date',
        errors: [
          {
            field: 'end_date',
            message: 'End date must be after start date',
            code: 'INVALID_DATE_RANGE',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    return this.experienceQuery.create(input);
  }

  /**
   * Update an experience by id (id is uuid; numeric id not exposed)
   */
  async update(id: string, input: UpdateExperienceDto): Promise<any> {
    const existingExperience = await this.experienceQuery.findByUuid(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    if (input.end_date && new Date(input.start_date) >= new Date(input.end_date)) {
      throw new BadRequestException({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Start date must be before end date',
        errors: [
          {
            field: 'end_date',
            message: 'End date must be after start date',
            code: 'INVALID_DATE_RANGE',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    const updatedExperience = await this.experienceQuery.updateByUuid(id, input);
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return updatedExperience;
  }

  /**
   * Toggle visibility by id (id is uuid)
   */
  async toggleVisibility(id: string, input: ToggleVisibilityDto): Promise<any> {
    const existingExperience = await this.experienceQuery.findByUuid(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    const updatedExperience = await this.experienceQuery.updateVisibilityByUuid(id, input.is_visible);
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return updatedExperience;
  }

  /**
   * Delete an experience by id (id is uuid; hard delete)
   */
  async delete(id: string): Promise<void> {
    const existingExperience = await this.experienceQuery.findByUuid(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    await this.experienceQuery.deleteByUuid(id);
  }
}
