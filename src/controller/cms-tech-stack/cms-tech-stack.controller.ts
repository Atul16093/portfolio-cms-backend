import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CmsProjectsService } from '../../services/cms-projects/cms-projects.service';
import { ResponseService } from '../../core/response-management';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * CMS Controller for Tech Stack
 * Routes requests to service layer - NO business logic here
 * All routes are admin-only (protected by AdminAuthGuard)
 */
@ApiTags('cms-tech-stack')
@Controller('cms/tech-stack')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CmsTechStackController {
  constructor(
    private cmsProjectsService: CmsProjectsService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tech stack grouped by category',
    description: 'Retrieve all tech stack items grouped by category for CMS (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tech stack grouped by category',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTechStack() {
    const techStack = await this.cmsProjectsService.getTechStackGrouped();
    return this.responseService.success(techStack);
  }
}
