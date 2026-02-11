import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialLinkDto {
  @ApiProperty({ description: 'Platform name', example: 'LinkedIn' })
  platform!: string;

  @ApiProperty({ description: 'Profile URL', example: 'https://linkedin.com/in/johndoe' })
  url!: string;
}

export class PublicSiteConfigDto {
  @ApiProperty({ description: 'Hero section title', example: 'Hi, I am John' })
  heroTitle!: string;

  @ApiPropertyOptional({ description: 'Hero section subtitle', example: 'Full Stack Developer', nullable: true })
  heroSubtitle?: string | null;

  @ApiPropertyOptional({ description: 'Hero section description', nullable: true })
  heroDescription?: string | null;

  @ApiPropertyOptional({ description: 'Primary CTA link', example: '#projects', nullable: true })
  primaryCtaLink?: string | null;

  @ApiPropertyOptional({ description: 'Secondary CTA link', example: '#contact', nullable: true })
  secondaryCtaLink?: string | null;

  @ApiPropertyOptional({ description: 'About section content', nullable: true })
  aboutContent?: string | null;

  @ApiPropertyOptional({ description: 'Footer text', nullable: true })
  footerText?: string | null;

  @ApiProperty({ description: 'Social media links', type: [SocialLinkDto] })
  socialLinks!: SocialLinkDto[];

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00Z' })
  updatedAt!: Date;
}
