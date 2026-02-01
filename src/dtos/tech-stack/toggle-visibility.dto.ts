import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Zod schema for toggling tech stack visibility
 */
export const toggleTechStackVisibilitySchema = z.object({
  is_visible: z.boolean(),
});

export type ToggleTechStackVisibilityDto = z.infer<typeof toggleTechStackVisibilitySchema>;

export class ToggleTechStackVisibilityRequestDto {
  @ApiProperty({ description: 'Visibility', example: true })
  is_visible!: boolean;
}
