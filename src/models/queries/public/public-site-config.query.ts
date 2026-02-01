import { Injectable } from '@nestjs/common';
import { BaseQuery } from '../base.query';

@Injectable()
export class PublicSiteConfigQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.site_config';
  }

  async getConfig(): Promise<any | null> {
    const row = await this.knex(this.getTableName())
        .where({ id: 1 })
        .first();

    if (!row) return null;

    let socialLinks = [];
    if (row.social_links) {
      try {
        socialLinks = typeof row.social_links === 'string' ? JSON.parse(row.social_links) : row.social_links;
      } catch (e) {
        socialLinks = [];
      }
    }

    // Return flattened structure matching required fields
    return {
      heroTitle: row.hero_title,
      heroSubtitle: row.hero_subtitle,
      heroDescription: row.hero_description,
      primaryCtaLink: row.primary_cta,
      secondaryCtaLink: row.secondary_cta,
      aboutContent: row.about_text,
      footerText: row.footer_text,
      socialLinks,
      updatedAt: row.updated_at,
    };
  }
}
