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
], { errorMap: () => ({ message: 'Category must be one of: backend, frontend, database, cloud, realtime, messaging, tools' }) });

/**
 * Zod schema for updating a tech stack item
 * All fields required for full update
 */
export const updateTechStackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: categoryEnum,
  icon_url: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform((v) => (v === '' ? null : v)),
  priority: z.number().int().min(0, 'Priority must be 0 or greater'),
  is_visible: z.boolean(),
});

export type UpdateTechStackDto = z.infer<typeof updateTechStackSchema>;

export class UpdateTechStackRequestDto {
  @ApiProperty({ description: 'Tech name (min 2 chars)', example: 'Node.js' })
  name!: string;

  @ApiProperty({
    description: 'Category',
    enum: ['backend', 'frontend', 'database', 'cloud', 'realtime', 'messaging', 'tools'],
  })
  category!: string;

  @ApiPropertyOptional({ description: 'Icon URL', nullable: true })
  icon_url?: string | null;

  @ApiProperty({ description: 'Display order', example: 0 })
  priority!: number;

  @ApiProperty({ description: 'Visibility', example: true })
  is_visible!: boolean;
}
