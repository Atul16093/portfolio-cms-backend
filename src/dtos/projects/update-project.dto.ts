import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Zod schema for updating a project
 * Validates title, slug, summary, isFeatured, status, and techStackIds
 * All fields except summary are required for update
 */
export const updateProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and kebab-case only')
    .min(1, 'Slug is required'),
  summary: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive']),
  isFeatured: z.boolean(),
  techStackIds: z.array(z.number().int().positive()),
});

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

/**
 * DTO interface for updating a project
 * Matches API contract and Zod schema validation
 */
export class UpdateProjectRequestDto {
  @ApiProperty({ description: 'Project title (minimum 3 characters)', example: 'My Awesome Project' })
  title!: string;

  @ApiProperty({
    description: 'URL-friendly slug (lowercase, kebab-case only)',
    example: 'my-awesome-project',
  })
  slug!: string;

  @ApiPropertyOptional({ description: 'Project summary', example: 'A brief description of the project', nullable: true })
  summary?: string | null;

  @ApiProperty({
    description: 'Project status',
    enum: ['active', 'inactive'],
    example: 'active',
  })
  status!: 'active' | 'inactive';

  @ApiProperty({ description: 'Whether the project is featured', example: false })
  isFeatured!: boolean;

  @ApiProperty({
    description: 'Array of tech stack IDs to associate with the project',
    type: [Number],
    example: [1, 2, 3],
  })
  techStackIds!: number[];
}
