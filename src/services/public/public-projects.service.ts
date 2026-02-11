import { Injectable, NotFoundException } from '@nestjs/common';
import { PublicProjectsQuery } from '../../models/queries/public/public-projects.query';
import { PublicProjectResponseDto } from '../../dtos/public/public-project.dto';

@Injectable()
export class PublicProjectsService {
  constructor(private readonly projectsQuery: PublicProjectsQuery) {}

  async getAllProjects(): Promise<PublicProjectResponseDto[]> {
    return this.projectsQuery.findAllActive();
  }

  async getProjectBySlug(slug: string): Promise<PublicProjectResponseDto> {
    const project = await this.projectsQuery.findBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }
    return project;
  }
}
