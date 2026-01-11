import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../db/database.connection';
import { BaseQuery } from './base.query';
import { SiteConfig, SiteConfigUpdateInput } from '../domain/site-config/site-config.types';
import { ISiteConfigRepository } from '../domain/site-config/site-config.contract';

@Injectable()
export class SiteConfigQuery implements ISiteConfigRepository {
  constructor(protected dbConnection: DatabaseConnection) {}

  protected get knex(): any {
    return this.dbConnection.getKnex();
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  protected getTableName(): string {
    return 'site_config';
  }

  protected mapToEntity(row: any): SiteConfig {
    return {
      id: row.id,
      siteName: row.site_name,
      siteDescription: row.site_description,
      contactEmail: row.contact_email,
      socialLinks: row.social_links ? JSON.parse(row.social_links) : {},
      metaTags: row.meta_tags ? JSON.parse(row.meta_tags) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async find(): Promise<SiteConfig | null> {
    const row = await this.knex(this.getTableName()).first();
    return row ? this.mapToEntity(row) : null;
  }

  async update(input: SiteConfigUpdateInput): Promise<SiteConfig> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.siteName !== undefined) updateData.site_name = input.siteName;
    if (input.siteDescription !== undefined) updateData.site_description = input.siteDescription;
    if (input.contactEmail !== undefined) updateData.contact_email = input.contactEmail;
    if (input.socialLinks !== undefined) updateData.social_links = JSON.stringify(input.socialLinks);
    if (input.metaTags !== undefined) updateData.meta_tags = JSON.stringify(input.metaTags);

    // Check if config exists, if not create it
    const existing = await this.find();
    
    if (!existing) {
      const now = new Date();
      const insertData = {
        id: this.generateId(),
        site_name: input.siteName || 'Portfolio',
        site_description: input.siteDescription || '',
        contact_email: input.contactEmail || '',
        social_links: input.socialLinks ? JSON.stringify(input.socialLinks) : '{}',
        meta_tags: input.metaTags ? JSON.stringify(input.metaTags) : '{}',
        created_at: now,
        updated_at: now,
      };

      const [row] = await this.knex(this.getTableName())
        .insert(insertData)
        .returning('*');

      return this.mapToEntity(row);
    }

    const [row] = await this.knex(this.getTableName())
      .update(updateData)
      .returning('*');

    return row ? this.mapToEntity(row) : null;
  }
}

