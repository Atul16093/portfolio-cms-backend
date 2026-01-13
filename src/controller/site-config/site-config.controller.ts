import {
  Controller,
  Get,
  Put,
  Body,
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
import { updateSiteConfigSchema } from '../../common/validation/zod.schemas';
import { SiteConfigUpdateInput } from '../../domain/site-config/site-config.types';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';

@ApiTags('site-config')
@Controller('site-config')
export class SiteConfigController {
  constructor(
    private siteConfigService: SiteConfigService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get site configuration', description: 'Retrieve the current site configuration' })
  @ApiResponse({ status: 200, description: 'Site configuration', type: StandardApiResponseDto })
  async find() {
    const config = await this.siteConfigService.find();
    return this.responseService.success(config);
  }

  @Put()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update site configuration', description: 'Update site configuration settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Site configuration updated successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body(new ZodValidationPipe(updateSiteConfigSchema)) body: SiteConfigUpdateInput) {
    const config = await this.siteConfigService.update(body);
    return this.responseService.updated(config);
  }
}

