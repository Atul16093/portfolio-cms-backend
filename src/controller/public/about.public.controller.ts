import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AboutService } from '../../services/about/about.service';

@ApiTags('public-about')
@Controller('public/about')
export class AboutPublicController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Get active about content' })
  @ApiResponse({ status: 200, description: 'Active about content' })
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
  async getActiveAbout() {
    return this.aboutService.getActive();
  }
}
