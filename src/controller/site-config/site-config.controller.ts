import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SiteConfigService } from '../../services/site-config/site-config.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { updateSiteConfigSchema } from '../../dtos/site-config/site-config.schema';
import { UpdateSiteConfigDto, SiteConfigResponseDto } from '../../dtos/site-config/site-config.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';

@ApiTags('cms-site-config')
@Controller('cms/site-config')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SiteConfigController {
  constructor(
    private siteConfigService: SiteConfigService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get site configuration', description: 'Retrieve the single site configuration for CMS' })
  @ApiResponse({ status: 200, description: 'Site configuration retrieved successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async find() {
    const config = await this.siteConfigService.find();
    return this.responseService.success(config);
  }

  @Put()
  @ApiOperation({ summary: 'Update site configuration', description: 'Update the single site configuration record (Admin only)' })
  @ApiResponse({ status: 200, description: 'Site configuration updated successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body(new ZodValidationPipe(updateSiteConfigSchema)) body: UpdateSiteConfigDto) {
    const config = await this.siteConfigService.update(body);
    return this.responseService.updated(config);
  }
}
