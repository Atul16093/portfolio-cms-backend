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
   * Update an experience by ID
   * Business logic:
   * - Validates experience exists
   * - Validates date range
   * - Updates all fields (no partial updates)
   */
  async update(id: number, input: UpdateExperienceDto): Promise<any> {
    // Business logic: Verify experience exists
    const existingExperience = await this.experienceQuery.findByIdNumber(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    // Business logic: Validate date range
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

    const updatedExperience = await this.experienceQuery.updateById(id, input);
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return updatedExperience;
  }

  /**
   * Toggle visibility status for an experience
   * Business logic:
   * - Validates experience exists
   * - Updates visibility status
   */
  async toggleVisibility(id: number, input: ToggleVisibilityDto): Promise<any> {
    // Business logic: Verify experience exists
    const existingExperience = await this.experienceQuery.findByIdNumber(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    const updatedExperience = await this.experienceQuery.updateVisibility(id, input.is_visible);
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return updatedExperience;
  }

  /**
   * Delete an experience by ID
   * Business logic:
   * - Validates experience exists before deletion
   * - Performs hard delete
   */
  async delete(id: number): Promise<void> {
    // Business logic: Verify experience exists
    const existingExperience = await this.experienceQuery.findByIdNumber(id);
    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    await this.experienceQuery.deleteById(id);
  }
}
