import {
  Controller,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { SiteConfigService } from '../../services/site-config/site-config.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { updateSiteConfigSchema } from '../../common/validation/zod.schemas';
import { SiteConfigUpdateInput } from '../../domain/site-config/site-config.types';

@Controller('site-config')
export class SiteConfigController {
  constructor(
    private siteConfigService: SiteConfigService,
    private responseService: ResponseService,
  ) {}

  @Get()
  async find() {
    const config = await this.siteConfigService.find();
    return this.responseService.success(config);
  }

  @Put()
  async update(@Body(new ZodValidationPipe(updateSiteConfigSchema)) body: SiteConfigUpdateInput) {
    const config = await this.siteConfigService.update(body);
    return this.responseService.updated(config);
  }
}

