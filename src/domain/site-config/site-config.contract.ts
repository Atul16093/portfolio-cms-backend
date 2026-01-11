import { SiteConfig, SiteConfigUpdateInput } from './site-config.types';

export interface ISiteConfigRepository {
  find(): Promise<SiteConfig | null>;
  update(input: SiteConfigUpdateInput): Promise<SiteConfig>;
}

