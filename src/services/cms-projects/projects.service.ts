import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { ProjectsQuery } from '../../models/queries/projects.query';
import { CreateProjectDto } from '../../dtos/projects/create-project.dto';
import { ProjectResponseDto } from '../../dtos/projects/project-response.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';

/**
 * Service layer for CMS project creation operations
 * Contains business logic and orchestration - NO database queries directly
 * Uses query layer for all database operations
 */
@Injectable()
export class ProjectsService {
  constructor(
    private projectsQuery: ProjectsQuery,
    private dbConnection: DatabaseConnection,
    private activityLogService: ActivityLogService,
  ) {}

  /**
   * Create a new project with associated tech stack
   * Business logic:
   * - Validates slug uniqueness
   * - Enforces default values (status: active, isFeatured: false)
   * - Uses transaction to ensure data consistency
   * - Attaches tech stack if provided
   */
  async create(input: CreateProjectDto): Promise<ProjectResponseDto> {
    // Business logic: Check slug uniqueness before creating
    const existingProject = await this.projectsQuery.findBySlug(input.slug);
    if (existingProject) {
      throw new ConflictException('Project with this slug already exists');
    }

    // Business logic: Enforce defaults if not provided
    const projectData: CreateProjectDto = {
      ...input,
      status: input.status || 'active',
      isFeatured: input.isFeatured ?? false,
      techStackIds: input.techStackIds || [],
    };

    // Use transaction to ensure atomicity: project and tech stack attachments
    const trx = await this.dbConnection.getKnex().transaction();

    try {
      // Insert project into data.projects
      const projectRow = await this.projectsQuery.insertProject(trx, projectData);

      // Attach tech stack if provided
      if (projectData.techStackIds && projectData.techStackIds.length > 0) {
        await this.projectsQuery.attachTechStack(trx, projectRow.id, projectData.techStackIds);
      }

      // Log activity: project created or published based on status
      const activityType = projectData.status === 'active' ? 'PROJECT_PUBLISHED' : 'PROJECT_CREATED';
      await this.activityLogService.logProjectActivity(
        activityType,
        projectRow.id,
        projectData.title,
        undefined, // adminUserId not available in this context
        trx,
      );

      // Commit transaction
      await trx.commit();

      // Fetch complete project with tech stack to return
      const createdProject = await this.projectsQuery.findByIdWithTechStack(projectRow.id);

      if (!createdProject) {
        throw new Error('Failed to retrieve created project');
      }

      return createdProject;
    } catch (error) {
      // Rollback transaction on any error
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Get all projects with their associated tech stack
   * No business logic - simply delegates to query layer
   */
  async findAll(options?: { limit?: number; offset?: number }): Promise<ProjectResponseDto[]> {
    return this.projectsQuery.findAllWithTechStack(options);
  }
}
