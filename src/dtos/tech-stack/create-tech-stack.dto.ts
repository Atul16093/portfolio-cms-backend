import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const categoryEnum = z.enum([
  'backend',
  'frontend',
  'database',
  'cloud',
  'realtime',
  'messaging',
  'tools',
] as const);

/**
 * Zod schema for creating a tech stack item
 * name min 2 chars, category enum, priority >= 0
 */
export const createTechStackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  icon_url: z
    .union([z.string().url(), z.literal(''), z.null()])
    .optional()
    .transform((v) => (v === '' || v == null ? null : v)),
  priority: z.number().int().min(0, 'Priority must be 0 or greater').optional().default(0),
});

export type CreateTechStackDto = z.infer<typeof createTechStackSchema>;

export class CreateTechStackRequestDto {
  @ApiProperty({ description: 'Tech name (min 2 chars)', example: 'Node.js' })
  name!: string;

  @ApiProperty({
    description: 'Category',
    enum: ['backend', 'frontend', 'database', 'cloud', 'realtime', 'messaging', 'tools'],
    example: 'backend',
  })
  category!: string;

  @ApiPropertyOptional({ description: 'Icon URL', example: 'https://example.com/icon.svg' })
  icon_url?: string | null;

  @ApiPropertyOptional({ description: 'Display order', example: 0 })
  priority?: number;
}
