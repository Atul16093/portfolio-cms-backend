import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ResponseService } from '../../core/response-management';
import { DashboardActivityRequestDto } from '../../dtos/dashboard/dashboard-request.dto';
import {
  DashboardSummaryResponseDto,
  DashboardActivityResponseDto,
} from '../../dtos/dashboard/dashboard-response.dto';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * CMS Dashboard Controller
 * Routes requests to service layer - NO business logic here
 * All routes are admin-only (protected by AdminAuthGuard)
 */
@ApiTags('dashboard')
@Controller('admin/dashboard')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private responseService: ResponseService,
  ) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get dashboard summary',
    description: 'Returns lightweight system overview for dashboard cards (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary with metrics',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSummary(): Promise<StandardApiResponseDto<DashboardSummaryResponseDto>> {
    // No validation needed - no request body or params
    // Business logic handled by service layer
    const summary = await this.dashboardService.getSummary();
    return this.responseService.success(summary);
  }

  @Get('activity')
  @ApiOperation({
    summary: 'Get dashboard activity feed',
    description: 'Returns recent system activities for dashboard feed (Admin only)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to return (default: 5, max: 20)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent system activities',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActivity(@Query() query: { limit?: string | number }): Promise<StandardApiResponseDto<DashboardActivityResponseDto>> {
    // Convert string query params to number if provided
    // Apply validation and defaults (limit: 5, max: 20)
    let limit = 5; // default
    if (query.limit !== undefined) {
      const parsedLimit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : query.limit;
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        throw new BadRequestException('Limit must be a positive number');
      }
      if (parsedLimit > 20) {
        throw new BadRequestException('Limit cannot exceed 20');
      }
      limit = parsedLimit;
    }

    // Business logic handled by service layer
    const activity = await this.dashboardService.getActivity({ limit });
    return this.responseService.success(activity);
  }
}
