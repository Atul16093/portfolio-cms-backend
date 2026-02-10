import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicExperienceDto {
  @ApiProperty({ description: 'Experience UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ description: 'Company name', example: 'Google' })
  company!: string;

  @ApiProperty({ description: 'Role title', example: 'Senior Software Engineer' })
  role!: string;

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2020-01-01', nullable: true })
  start_date?: string | null;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD) or null if current', example: '2023-01-01', nullable: true })
  end_date?: string | null;

  @ApiPropertyOptional({ description: 'Description of key responsibilities', example: 'Built scalable systems...', nullable: true })
  description?: string | null;

  @ApiProperty({ description: 'Display order', example: 1 })
  order_index!: number;

  @ApiProperty({ description: 'Visibility status', example: true })
  is_visible!: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
  created_at!: Date;
}
