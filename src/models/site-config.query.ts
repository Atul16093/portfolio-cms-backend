import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../db/database.connection';
import { BaseQuery } from './queries/base.query';
import { SiteConfig, SiteConfigUpdateInput } from '../domain/site-config/site-config.types';
import { ISiteConfigRepository } from '../domain/site-config/site-config.contract';

/**
 * @deprecated This file seems to be a duplicate of src/models/queries/site-config.query.ts
 * Please use the one in src/models/queries/ instead.
 * Kept here to fix build errors.
 */
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
      primaryCtaText: row.primary_cta_text,
      primaryCtaLink: row.primary_cta_link,
      secondaryCtaText: row.secondary_cta_text,
      secondaryCtaLink: row.secondary_cta_link,
      aboutHeading: row.about_heading,
      aboutContent: row.about_content,
      socialLinks,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      ogImageUrl: row.og_image_url,
      footerText: row.footer_text,
      closingLine: row.closing_line,
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
    const dbData: any = {
      hero_title: input.heroTitle,
      hero_subtitle: input.heroSubtitle,
      hero_description: input.heroDescription,
      primary_cta_text: input.primaryCtaText,
      primary_cta_link: input.primaryCtaLink,
      secondary_cta_text: input.secondaryCtaText,
      secondary_cta_link: input.secondaryCtaLink,
      about_heading: input.aboutHeading,
      about_content: input.aboutContent,
      social_links: input.socialLinks ? JSON.stringify(input.socialLinks) : '[]',
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      og_image_url: input.ogImageUrl,
      footer_text: input.footerText,
      closing_line: input.closingLine,
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
