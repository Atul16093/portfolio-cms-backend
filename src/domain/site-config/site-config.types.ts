import { BaseEntity } from '../shared/base.contract';

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  primaryCtaText?: string | null;
  primaryCtaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  aboutHeading?: string | null;
  aboutContent?: string | null;
  socialLinks: Array<{ platform: string; url: string }>;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  footerText?: string | null;
  closingLine?: string | null;
  updatedAt: Date;
}

export type SiteConfigUpdateInput = Partial<Omit<SiteConfig, 'updatedAt'>>;
