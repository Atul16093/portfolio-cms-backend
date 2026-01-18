import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Zod schema for creating a project
 * Validates title (min 3 chars), slug (kebab-case), status, isFeatured, and techStackIds
 */
export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and kebab-case only')
    .min(1, 'Slug is required'),
  summary: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  isFeatured: z.boolean().optional().default(false),
  techStackIds: z.array(z.number().int().positive()).optional().default([]),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

/**
 * DTO interface for creating a project
 * Matches API contract and Zod schema validation
 */
export class CreateProjectRequestDto {
  @ApiProperty({ description: 'Project title (minimum 3 characters)', example: 'My Awesome Project' })
  title!: string;

  @ApiProperty({
    description: 'URL-friendly slug (lowercase, kebab-case only)',
    example: 'my-awesome-project',
  })
  slug!: string;

  @ApiPropertyOptional({ description: 'Project summary', example: 'A brief description of the project' })
  summary?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ['active', 'inactive'],
    default: 'active',
    example: 'active',
  })
  status?: 'active' | 'inactive';

  @ApiPropertyOptional({ description: 'Whether the project is featured', default: false, example: false })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Array of tech stack IDs to associate with the project',
    type: [Number],
    example: [1, 2, 3],
  })
  techStackIds?: number[];
}
