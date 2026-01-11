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
} from '@nestjs/common';
import { ProjectService } from '../../services/projects/project.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../../common/validation/zod.schemas';
import { ProjectCreateInput, ProjectUpdateInput, ProjectQueryOptions } from '../../domain/projects/project.types';

@Controller('projects')
export class ProjectsController {
  constructor(
    private projectService: ProjectService,
    private responseService: ResponseService,
  ) {}

  @Get()
  async findAll(@Query() query: ProjectQueryOptions) {
    const projects = await this.projectService.findAll(query);
    return this.responseService.success(projects);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const project = await this.projectService.findById(id);
    return this.responseService.success(project);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const project = await this.projectService.findBySlug(slug);
    return this.responseService.success(project);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidationPipe(createProjectSchema)) body: ProjectCreateInput) {
    const project = await this.projectService.create(body);
    return this.responseService.created(project);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProjectSchema)) body: ProjectUpdateInput,
  ) {
    const project = await this.projectService.update(id, body);
    return this.responseService.updated(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return this.responseService.deleted();
  }
}

