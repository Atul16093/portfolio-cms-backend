import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ctaLinkSchema = z.string().refine(
  (val) => val.startsWith('#') || val.startsWith('/') || z.string().url().safeParse(val).success,
  { message: 'CTA link must be a valid URL, start with "#", or start with "/"' }
);

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
});

export const updateSiteConfigSchema = z.object({
  heroTitle: z.string().min(3, 'Hero title must be at least 3 characters'),
  heroSubtitle: z.string().optional().nullable(),
  heroDescription: z.string().optional().nullable(),
  primaryCtaText: z.string().optional().nullable(),
  primaryCtaLink: ctaLinkSchema.optional().nullable(),
  secondaryCtaText: z.string().optional().nullable(),
  secondaryCtaLink: ctaLinkSchema.optional().nullable(),
  aboutHeading: z.string().optional().nullable(),
  aboutContent: z.string().optional().nullable(),
  socialLinks: z.array(socialLinkSchema).optional().default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional().nullable(),
  ogImageUrl: z.string().url('Invalid OG image URL').optional().nullable().or(z.literal('')),
  footerText: z.string().optional().nullable(),
  closingLine: z.string().optional().nullable(),
});

export type UpdateSiteConfigDto = z.infer<typeof updateSiteConfigSchema>;

export class SiteConfigResponseDto {
  @ApiProperty({ example: 'Hello, I am Atul' })
  heroTitle!: string;

  @ApiPropertyOptional({ example: 'Full Stack Developer', nullable: true })
  heroSubtitle?: string | null;

  @ApiPropertyOptional({ example: 'Detailed description...', nullable: true })
  heroDescription?: string | null;

  @ApiPropertyOptional({ example: 'View Projects', nullable: true })
  primaryCtaText?: string | null;

  @ApiPropertyOptional({ example: '#projects', nullable: true })
  primaryCtaLink?: string | null;

  @ApiPropertyOptional({ example: 'Contact Me', nullable: true })
  secondaryCtaText?: string | null;

  @ApiPropertyOptional({ example: '/contact', nullable: true })
  secondaryCtaLink?: string | null;

  @ApiPropertyOptional({ example: 'About Me', nullable: true })
  aboutHeading?: string | null;

  @ApiPropertyOptional({ example: 'I am a passionate developer...', nullable: true })
  aboutContent?: string | null;

  @ApiProperty({ type: [Object], example: [{ platform: 'GitHub', url: 'https://github.com' }] })
  socialLinks!: Array<{ platform: string; url: string }>;

  @ApiPropertyOptional({ example: 'Portfolio - Atul', nullable: true })
  metaTitle?: string | null;

  @ApiPropertyOptional({ example: 'Welcome to my portfolio website', nullable: true })
  metaDescription?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/og.png', nullable: true })
  ogImageUrl?: string | null;

  @ApiPropertyOptional({ example: '© 2024 Atul', nullable: true })
  footerText?: string | null;

  @ApiPropertyOptional({ example: 'Let us build something together.', nullable: true })
  closingLine?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt!: Date;
}
