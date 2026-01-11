export interface SiteConfigEntity {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  metaTags: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

