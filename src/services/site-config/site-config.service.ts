import { Injectable } from '@nestjs/common';
import { SiteConfigQuery } from '../../models/queries/site-config.query';
import { SiteConfig, SiteConfigUpdateInput } from '../../domain/site-config/site-config.types';

@Injectable()
export class SiteConfigService {
  constructor(private siteConfigQuery: SiteConfigQuery) {}

  async find(): Promise<SiteConfig> {
    const config = await this.siteConfigQuery.find();
    if (!config) {
      // Return default config if none exists
      return {
        id: '',
        siteName: 'Portfolio',
        siteDescription: '',
        contactEmail: '',
        socialLinks: {},
        metaTags: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return config;
  }

  async update(input: SiteConfigUpdateInput): Promise<SiteConfig> {
    return this.siteConfigQuery.update(input);
  }
}

