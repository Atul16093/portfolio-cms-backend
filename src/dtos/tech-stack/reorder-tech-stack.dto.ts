import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Zod schema for reorder batch payload
 * Array of { id, priority } with priority >= 0
 */
export const reorderTechStackSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int().positive('ID must be a positive integer'),
      priority: z.number().int().min(0, 'Priority must be 0 or greater'),
    }),
  ),
});

export type ReorderTechStackDto = z.infer<typeof reorderTechStackSchema>;

/** Request body: array at top level per spec */
export const reorderTechStackBodySchema = z.array(
  z.object({
    id: z.number().int().positive('ID must be a positive integer'),
    priority: z.number().int().min(0, 'Priority must be 0 or greater'),
  }),
);

export type ReorderTechStackBodyDto = z.infer<typeof reorderTechStackBodySchema>;

export class ReorderTechStackItemDto {
  @ApiProperty({ description: 'Tech stack item ID', example: 1 })
  id!: number;

  @ApiProperty({ description: 'New priority', example: 0 })
  priority!: number;
}
