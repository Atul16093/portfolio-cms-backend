import { Injectable } from '@nestjs/common';
import { SiteConfigQuery } from '../../models/queries/site-config.query';
import { SiteConfig, SiteConfigUpdateInput } from '../../domain/site-config/site-config.types';

@Injectable()
export class SiteConfigService {
  constructor(private siteConfigQuery: SiteConfigQuery) {}

  /**
   * Get site configuration
   * Returns default values if no configuration exists
   */
  async find(): Promise<SiteConfig> {
    const config = await this.siteConfigQuery.getConfig();
    
    if (!config) {
      // Return default empty structure as per requirement
      return {
        heroTitle: 'Welcome to My Portfolio',
        heroSubtitle: null,
        heroDescription: null,
        primaryCtaText: null,
        primaryCtaLink: null,
        secondaryCtaText: null,
        secondaryCtaLink: null,
        aboutHeading: null,
        aboutContent: null,
        socialLinks: [],
        metaTitle: null,
        metaDescription: null,
        ogImageUrl: null,
        footerText: null,
        closingLine: null,
        updatedAt: new Date(),
      };
    }
    
    return config;
  }

  /**
   * Update site configuration
   * Orchestrates the update of the single configuration row
   */
  async update(input: SiteConfigUpdateInput): Promise<SiteConfig> {
    // Business logic: Ensure only the single config row is updated (handled by query layer)
    return this.siteConfigQuery.updateConfig(input);
  }
}
