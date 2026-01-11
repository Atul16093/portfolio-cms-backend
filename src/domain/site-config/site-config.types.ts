import { BaseEntity, BaseUpdateInput } from '../shared/base.contract';

export interface SiteConfig extends BaseEntity {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  metaTags: Record<string, string>;
}

export interface SiteConfigUpdateInput extends BaseUpdateInput {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
  metaTags?: Record<string, string>;
}

