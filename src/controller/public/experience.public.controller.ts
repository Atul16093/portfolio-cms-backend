import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicExperienceService } from '../../services/public/public-experience.service';
import { PublicExperienceDto } from '../../dtos/public/public-experience.dto';

@ApiTags('public-experience')
@Controller('public/experience')
export class ExperiencePublicController {
  constructor(private readonly experienceService: PublicExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all visible experience entries' })
  @ApiResponse({ status: 200, description: 'List of experience entries', type: [PublicExperienceDto] })
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=60')
  async getExperience() {
    return this.experienceService.getAllExperience();
  }
}
