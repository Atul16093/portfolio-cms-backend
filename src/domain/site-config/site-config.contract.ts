import { SiteConfig, SiteConfigUpdateInput } from './site-config.types';

export interface ISiteConfigRepository {
  getConfig(): Promise<SiteConfig | null>;
  updateConfig(input: SiteConfigUpdateInput): Promise<SiteConfig>;
}

