import { Injectable, NotFoundException } from '@nestjs/common';
import { PublicSiteConfigQuery } from '../../models/queries/public/public-site-config.query';

@Injectable()
export class PublicSiteConfigService {
  constructor(private readonly siteConfigQuery: PublicSiteConfigQuery) {}

  async getConfig(): Promise<any> {
    const config = await this.siteConfigQuery.getConfig();
    // Start with empty defaults if not configured
    if (!config) {
        throw new NotFoundException('Site configuration not found');
    }
    return config;
  }
}
