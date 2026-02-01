import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicSiteConfigService } from '../../services/public/public-site-config.service';
import { PublicSiteConfigDto } from '../../dtos/public/public-site-config.dto';

@ApiTags('public-site-config')
@Controller('public/site-config')
export class SiteConfigPublicController {
  constructor(private readonly siteConfigService: PublicSiteConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get public site configuration' })
  @ApiResponse({ status: 200, description: 'Site configuration details', type: PublicSiteConfigDto })
  @Header('Cache-Control', 'public, max-age=1800, stale-while-revalidate=60')
  async getConfig() {
    return this.siteConfigService.getConfig();
  }
}
