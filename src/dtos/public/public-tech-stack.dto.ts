import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicTechStackItemDto {
  @ApiProperty({ description: 'Tech stack ID (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Tech stack name', example: 'React' })
  name!: string;

  @ApiProperty({ description: 'Category', example: 'Frontend' })
  category!: string;

  @ApiPropertyOptional({ description: 'Icon URL', example: 'https://example.com/react.png', nullable: true })
  iconUrl?: string | null;

  @ApiProperty({ description: 'Display priority', example: 1 })
  priority!: number;
}

export class PublicTechStackResponseDto {
  @ApiProperty({ 
    description: 'Tech stack items grouped by category',
    example: {
      Frontend: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'React', category: 'Frontend', priority: 1 }]
    }
  })
  data!: Record<string, PublicTechStackItemDto[]>;
}
