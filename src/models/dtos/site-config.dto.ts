export class UpdateSiteConfigDto {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
  metaTags?: Record<string, string>;
}

export class SiteConfigResponseDto {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  metaTags: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

