import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tech stack item in project response
 */
export class ProjectTechStackDto {
  @ApiProperty({ description: 'Tech stack ID', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Tech stack name', example: 'React' })
  name!: string;

  @ApiProperty({ description: 'Tech stack category', example: 'Frontend' })
  category!: string;

  @ApiPropertyOptional({ description: 'Icon URL', example: 'https://example.com/react-icon.png' })
  iconUrl?: string;
}

/**
 * Project response DTO (full format with tech stack objects)
 * Used for detailed project views
 */
export class ProjectResponseDto {
  @ApiProperty({ description: 'Project ID', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Project UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid!: string;

  @ApiProperty({ description: 'Project title', example: 'My Awesome Project' })
  title!: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'my-awesome-project' })
  slug!: string;

  @ApiPropertyOptional({ description: 'Project summary', example: 'A brief description' })
  summary?: string;

  @ApiProperty({ description: 'Whether the project is featured', example: false })
  isFeatured!: boolean;

  @ApiProperty({ description: 'Project status', enum: ['active', 'inactive'], example: 'active' })
  status!: string;

  @ApiProperty({ description: 'Associated tech stack', type: [ProjectTechStackDto] })
  techStack!: ProjectTechStackDto[];

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;
}

/**
 * Project list item DTO (simplified format for CMS list view)
 * Includes updated_at and simplified tech stack
 */
export class ProjectListItemDto {
  @ApiProperty({ description: 'Project UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid!: string;

  @ApiProperty({ description: 'Project title', example: 'My Awesome Project' })
  title!: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'my-awesome-project' })
  slug!: string;

  @ApiProperty({ description: 'Whether the project is featured', example: false })
  isFeatured!: boolean;

  @ApiProperty({ description: 'Project status', enum: ['active', 'inactive'], example: 'active' })
  status!: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Associated tech stack (simplified)',
    type: [ProjectTechStackDto],
  })
  techStack!: Array<{ id: number; name: string; iconUrl?: string }>;
}

/**
 * Project edit DTO (for edit page - includes tech_stack_ids array)
 * Used when fetching a project for editing
 */
export class ProjectEditDto {
  @ApiProperty({ description: 'Project UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid!: string;

  @ApiProperty({ description: 'Project title', example: 'My Awesome Project' })
  title!: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'my-awesome-project' })
  slug!: string;

  @ApiPropertyOptional({ description: 'Project summary', example: 'A brief description', nullable: true })
  summary?: string | null;

  @ApiProperty({ description: 'Whether the project is featured', example: false })
  isFeatured!: boolean;

  @ApiProperty({ description: 'Project status', enum: ['active', 'inactive'], example: 'active' })
  status!: string;

  @ApiProperty({
    description: 'Associated tech stack',
    type: [ProjectTechStackDto],
  })
  techStack!: ProjectTechStackDto[];
}
