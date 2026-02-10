import { Controller, Get, Param, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PublicProjectsService } from '../../services/public/public-projects.service';
import { PublicProjectResponseDto } from '../../dtos/public/public-project.dto';

@ApiTags('public-projects')
@Controller('public/projects')
export class ProjectsPublicController {
  constructor(private readonly projectsService: PublicProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active featured projects' })
  @ApiResponse({ status: 200, description: 'List of active projects', type: [PublicProjectResponseDto] })
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get project details by slug' })
  @ApiParam({ name: 'slug', description: 'Project slug', example: 'my-awesome-project' })
  @ApiResponse({ status: 200, description: 'Project details', type: PublicProjectResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Header('Cache-Control', 'public, max-age=1800, stale-while-revalidate=60')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.getProjectBySlug(slug);
  }
}
