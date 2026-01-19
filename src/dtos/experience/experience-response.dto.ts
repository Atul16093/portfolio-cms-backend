import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for experience entity
 * Maps database fields to API response format
 */
export class ExperienceResponseDto {
  @ApiProperty({ description: 'Experience ID', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Company name', example: 'Tech Corp' })
  company!: string;

  @ApiProperty({ description: 'Job role', example: 'Senior Developer' })
  role!: string;

  @ApiProperty({ description: 'Start date', example: '2020-01-01' })
  start_date!: string;

  @ApiProperty({ description: 'End date (null for current role)', example: '2022-12-31', nullable: true })
  end_date!: string | null;

  @ApiProperty({ description: 'Job description', example: 'Developed and maintained web applications' })
  description!: string;

  @ApiProperty({ description: 'Display order', example: 0 })
  order_index!: number;

  @ApiProperty({ description: 'Visibility status', example: true })
  is_visible!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;
}
