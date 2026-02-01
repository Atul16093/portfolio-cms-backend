import { Injectable } from '@nestjs/common';
import { BaseQuery } from './base.query';
import { SiteConfig, SiteConfigUpdateInput } from '../../domain/site-config/site-config.types';
import { ISiteConfigRepository } from '../../domain/site-config/site-config.contract';

@Injectable()
export class SiteConfigQuery extends BaseQuery implements ISiteConfigRepository {
  protected getTableName(): string {
    return 'data.site_config';
  }

  /**
   * Map database row to SiteConfig entity
   * Transforms snake_case DB columns to camelCase DTO format
   */
  protected mapToEntity(row: any): SiteConfig {
    if (!row) return null;

    let socialLinks = [];
    if (row.social_links) {
      try {
        socialLinks = typeof row.social_links === 'string' ? JSON.parse(row.social_links) : row.social_links;
      } catch (e) {
        console.error('Failed to parse social_links', e);
        socialLinks = [];
      }
    }

    return {
      heroTitle: row.hero_title,
      heroSubtitle: row.hero_subtitle,
      heroDescription: row.hero_description,
      // DB has 'primary_cta' and 'secondary_cta' as single strings, likely links
      primaryCtaText: null, // Not in DB
      primaryCtaLink: row.primary_cta,
      secondaryCtaText: null, // Not in DB
      secondaryCtaLink: row.secondary_cta,
      aboutHeading: null, // Not in DB
      aboutContent: row.about_text,
      socialLinks,
      metaTitle: null, // Not in DB
      metaDescription: null, // Not in DB
      ogImageUrl: null, // Not in DB
      footerText: row.footer_text,
      closingLine: null, // Not in DB
      updatedAt: row.updated_at,
    };
  }

  /**
   * Get the single site configuration record (id = 1)
   */
  async getConfig(): Promise<SiteConfig | null> {
    const row = await this.knex(this.getTableName()).where({ id: 1 }).first();
    return row ? this.mapToEntity(row) : null;
  }

  /**
   * Update or create the single site configuration record
   */
  async updateConfig(input: SiteConfigUpdateInput): Promise<SiteConfig> {
    const now = new Date();
    
    // Map input fields to ACTUAL database columns
    const dbData: any = {
      hero_title: input.heroTitle,
      hero_subtitle: input.heroSubtitle,
      hero_description: input.heroDescription,
      primary_cta: input.primaryCtaLink, // Mapping link to primary_cta
      secondary_cta: input.secondaryCtaLink, // Mapping link to secondary_cta
      about_text: input.aboutContent, // Mapping content to about_text
      footer_text: input.footerText,
      social_links: input.socialLinks ? JSON.stringify(input.socialLinks) : '[]',
      updated_at: now,
    };

    // Use upsert logic for id = 1
    const existing = await this.knex(this.getTableName()).where({ id: 1 }).first();

    if (existing) {
      const [row] = await this.knex(this.getTableName())
        .where({ id: 1 })
        .update(dbData)
        .returning('*');
      return this.mapToEntity(row);
    } else {
      const [row] = await this.knex(this.getTableName())
        .insert({ ...dbData, id: 1 })
        .returning('*');
      return this.mapToEntity(row);
    }
  }
}
