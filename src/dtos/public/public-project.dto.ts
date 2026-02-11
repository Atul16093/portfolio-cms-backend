import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicProjectTechStackDto {
  @ApiProperty({ description: 'Tech stack ID (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Tech stack name', example: 'React' })
  name!: string;

  @ApiProperty({ description: 'Tech stack category', example: 'Frontend' })
  category!: string;

  @ApiPropertyOptional({ description: 'Icon URL', example: 'https://example.com/react-icon.png' })
  iconUrl?: string;
}

export class PublicProjectResponseDto {
  @ApiProperty({ description: 'Project ID (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

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

  @ApiProperty({ description: 'Associated tech stack', type: [PublicProjectTechStackDto] })
  techStack!: PublicProjectTechStackDto[];

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;
}
