import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Zod schema for dashboard activity request
 * Validates limit parameter (optional, default: 5, max: 20)
 */
export const dashboardActivityRequestSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(20, 'Limit cannot exceed 20')
    .optional()
    .default(5),
});

/**
 * DTO interface for dashboard activity request
 * Matches API contract and Zod schema validation
 */
export class DashboardActivityRequestDto {
  @ApiPropertyOptional({
    description: 'Number of activities to return (default: 5, max: 20)',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    example: 5,
  })
  limit?: number;
}
