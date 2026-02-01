import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Zod schema for toggling experience visibility
 * Validates is_visible boolean field
 */
export const toggleVisibilitySchema = z.object({
  is_visible: z.boolean(),
});

export type ToggleVisibilityDto = z.infer<typeof toggleVisibilitySchema>;

/**
 * DTO interface for toggling experience visibility
 * Matches API contract and Zod schema validation
 */
export class ToggleVisibilityRequestDto {
  @ApiProperty({ description: 'Visibility status', example: true })
  is_visible!: boolean;
}
