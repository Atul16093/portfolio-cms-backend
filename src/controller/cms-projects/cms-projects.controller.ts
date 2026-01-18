import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CmsProjectsService } from '../../services/cms-projects/cms-projects.service';
import { ProjectsService } from '../../services/cms-projects/projects.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createProjectSchema } from '../../dtos/projects/create-project.schema';
import { CreateProjectDto } from '../../dtos/projects/create-project.dto';
import { updateProjectSchema } from '../../dtos/projects/update-project.dto';
import { UpdateProjectDto, UpdateProjectRequestDto } from '../../dtos/projects/update-project.dto';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * CMS Controller for Project Management
 * Routes requests to service layer - NO business logic here
 * All routes are admin-only (protected by AdminAuthGuard)
 */
@ApiTags('cms-projects')
@Controller('cms/projects')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CmsProjectsController {
  constructor(
    private cmsProjectsService: CmsProjectsService,
    private projectsService: ProjectsService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Create a new project with optional tech stack associations (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Project with slug already exists' })
  async create(@Body(new ZodValidationPipe(createProjectSchema)) body: CreateProjectDto) {
    // Validation handled by ZodValidationPipe
    // Business logic handled by service layer
    const project = await this.projectsService.create(body);
    return this.responseService.created(project);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects (CMS list view)',
    description: 'Retrieve all projects with simplified tech stack, ordered by updated_at desc (Admin only)',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of projects with tech stack',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: { limit?: number; offset?: number }) {
    // Convert string query params to numbers if provided
    const options = {
      limit: query.limit ? Number(query.limit) : undefined,
      offset: query.offset ? Number(query.offset) : undefined,
    };

    const projects = await this.cmsProjectsService.findAll(options);
    return this.responseService.success(projects);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get single project for edit page',
    description: 'Retrieve a project by UUID with tech_stack_ids for editing (Admin only)',
  })
  @ApiParam({ name: 'uuid', description: 'Project UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Project details for editing',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('uuid') uuid: string) {
    const project = await this.cmsProjectsService.findOneForEdit(uuid);
    return this.responseService.success(project);
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'Update a project',
    description: 'Update a project by UUID with optional tech stack sync (Admin only)',
  })
  @ApiParam({ name: 'uuid', description: 'Project UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Project with slug already exists' })
  async update(
    @Param('uuid') uuid: string,
    @Body(new ZodValidationPipe(updateProjectSchema)) body: UpdateProjectDto,
  ) {
    // Validation handled by ZodValidationPipe
    // Business logic handled by service layer
    const project = await this.cmsProjectsService.update(uuid, body);
    return this.responseService.updated(project);
  }

  @Patch(':uuid/featured')
  @ApiOperation({
    summary: 'Toggle featured status',
    description: 'Toggle the featured status of a project (Admin only)',
  })
  @ApiParam({ name: 'uuid', description: 'Project UUID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Featured status toggled successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async toggleFeatured(@Param('uuid') uuid: string) {
    const result = await this.cmsProjectsService.toggleFeatured(uuid);
    return this.responseService.success(result);
  }
}
