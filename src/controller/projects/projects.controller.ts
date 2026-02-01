import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { ProjectService } from '../../services/projects/project.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../../common/validation/zod.schemas';
import { ProjectCreateInput, ProjectUpdateInput, ProjectQueryOptions } from '../../domain/projects/project.types';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * Public API Controller for Projects
 * Routes requests to service layer - NO business logic here
 * Public endpoints for reading projects, admin-only for write operations
 */
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all projects', description: 'Get a list of all projects with optional filtering' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'List of projects', type: StandardApiResponseDto })
  async findAll(@Query() query: ProjectQueryOptions) {
    const projects = await this.projectService.findAll(query);
    return this.responseService.success(projects);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID', description: 'Retrieve a specific project by its ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: String })
  @ApiResponse({ status: 200, description: 'Project details', type: StandardApiResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findById(@Param('id') id: string) {
    const project = await this.projectService.findById(id);
    return this.responseService.success(project);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get project by slug', description: 'Retrieve a specific project by its slug' })
  @ApiParam({ name: 'slug', description: 'Project slug', type: String })
  @ApiResponse({ status: 200, description: 'Project details', type: StandardApiResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findBySlug(@Param('slug') slug: string) {
    const project = await this.projectService.findBySlug(slug);
    return this.responseService.success(project);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create new project', description: 'Create a new project (Admin only)' })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body(new ZodValidationPipe(createProjectSchema)) body: ProjectCreateInput) {
    const project = await this.projectService.create(body);
    return this.responseService.created(project);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update project', description: 'Update an existing project (Admin only)' })
  @ApiParam({ name: 'id', description: 'Project ID', type: String })
  @ApiResponse({ status: 200, description: 'Project updated successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProjectSchema)) body: ProjectUpdateInput,
  ) {
    const project = await this.projectService.update(id, body);
    return this.responseService.updated(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete project', description: 'Delete a project by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Project ID', type: String })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return this.responseService.deleted();
  }
}
