import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicTechStackService } from '../../services/public/public-tech-stack.service';
import { PublicTechStackResponseDto } from '../../dtos/public/public-tech-stack.dto';

@ApiTags('public-tech-stack')
@Controller('public/tech-stack')
export class TechStackPublicController {
  constructor(private readonly techStackService: PublicTechStackService) {}

  @Get()
  @ApiOperation({ summary: 'Get tech stack grouped by category' })
  @ApiResponse({ status: 200, description: 'Tech stack grouped by category', type: PublicTechStackResponseDto })
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=60')
  async getTechStack() {
    return this.techStackService.getTechStack();
  }
}
