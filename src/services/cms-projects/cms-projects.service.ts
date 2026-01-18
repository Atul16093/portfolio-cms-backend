import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { ProjectsQuery } from '../../models/queries/projects.query';
import { ProjectTechStackQuery } from '../../models/queries/project-tech-stack.query';
import { TechStackQuery } from '../../models/queries/tech-stack.query';
import { UpdateProjectDto } from '../../dtos/projects/update-project.dto';
import { ProjectListItemDto, ProjectEditDto } from '../../dtos/projects/project-response.dto';
import { TechStackGrouped } from '../../models/queries/tech-stack.query';

/**
 * Service layer for CMS project operations
 * Contains business logic and orchestration - NO database queries directly
 * Uses query layer for all database operations
 */
@Injectable()
export class CmsProjectsService {
  constructor(
    private projectsQuery: ProjectsQuery,
    private projectTechStackQuery: ProjectTechStackQuery,
    private techStackQuery: TechStackQuery,
    private dbConnection: DatabaseConnection,
  ) {}

  /**
   * Get all projects for CMS list view
   * Business logic: None - simply delegates to query layer
   */
  async findAll(options?: { limit?: number; offset?: number }): Promise<ProjectListItemDto[]> {
    return this.projectsQuery.findAllForList(options);
  }

  /**
   * Get single project for edit page by UUID
   * Business logic:
   * - Validates project exists
   * - Fetches project data and associated tech stack IDs
   */
  async findOneForEdit(uuid: string): Promise<ProjectEditDto> {
    // Fetch project data
    const project = await this.projectsQuery.findForEdit(uuid);
    if (!project) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }

    // Fetch project ID from database (needed to get tech stack IDs)
    const projectRow = await this.projectsQuery.findByUuid(uuid);
    if (!projectRow) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }

    // Fetch tech stack IDs for this project
    const techStackIds = await this.projectTechStackQuery.getTechStackIdsByProjectId(projectRow.id);

    return {
      ...project,
      techStackIds,
    };
  }

  /**
   * Get all tech stack items grouped by category
   * Business logic: None - delegates to query layer which handles grouping
   */
  async getTechStackGrouped(): Promise<TechStackGrouped> {
    return this.techStackQuery.findAllGroupedByCategory();
  }

  /**
   * Update a project by UUID
   * Business logic:
   * - Validates project exists
   * - Validates slug uniqueness (if slug is being updated)
   * - Syncs tech stack associations
   * - Uses transaction to ensure data consistency
   */
  async update(uuid: string, input: UpdateProjectDto): Promise<ProjectEditDto> {
    // Business logic: Verify project exists
    const existingProject = await this.projectsQuery.findByUuid(uuid);
    if (!existingProject) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }

    // Business logic: Check slug uniqueness if slug is being updated
    if (input.slug && input.slug !== existingProject.slug) {
      const slugExists = await this.projectsQuery.findBySlug(input.slug);
      if (slugExists && slugExists.uuid !== uuid) {
        throw new ConflictException('Project with this slug already exists');
      }
    }

    // Use transaction to ensure atomicity: project update and tech stack sync
    const trx = await this.dbConnection.getKnex().transaction();

    try {
      // Update project in data.projects
      const updatedProjectRow = await this.projectsQuery.updateProject(trx, uuid, input);

      // Sync tech stack associations (always sync since techStackIds is required)
      // Validate tech stack IDs exist
      const validTechStackIds = await this.techStackQuery.validateTechStackIds(input.techStackIds);
      
      // Sync associations (delete old, insert new)
      await this.projectTechStackQuery.syncTechStack(trx, updatedProjectRow.id, validTechStackIds);

      // Commit transaction
      await trx.commit();

      // Fetch complete updated project with tech stack IDs
      const result = await this.findOneForEdit(uuid);
      return result;
    } catch (error) {
      // Rollback transaction on any error
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Toggle featured status for a project
   * Business logic:
   * - Validates project exists
   * - Toggles is_featured boolean
   */
  async toggleFeatured(uuid: string): Promise<{ uuid: string; isFeatured: boolean }> {
    // Business logic: Verify project exists
    const existingProject = await this.projectsQuery.findByUuid(uuid);
    if (!existingProject) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }

    // Toggle featured status
    const updatedRow = await this.projectsQuery.toggleFeatured(uuid);
    if (!updatedRow) {
      throw new NotFoundException(`Project with UUID ${uuid} not found`);
    }

    return {
      uuid: updatedRow.uuid,
      isFeatured: updatedRow.is_featured,
    };
  }
}
