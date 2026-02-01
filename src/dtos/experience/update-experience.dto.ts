import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Zod schema for updating an experience
 * All fields are required (no partial updates)
 * Validates company (min 2 chars), role (min 2 chars), dates, description, order_index, and is_visible
 * Enforces start_date < end_date if end_date is provided
 */
export const updateExperienceSchema = z
  .object({
    company: z.string().min(2, 'Company must be at least 2 characters'),
    role: z.string().min(2, 'Role must be at least 2 characters'),
    // Accept both YYYY-MM-DD and ISO date strings, normalize to YYYY-MM-DD
    start_date: z
      .string()
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: 'Start date must be a valid date' },
      )
      .transform((val) => {
        // Normalize to YYYY-MM-DD format
        const date = new Date(val);
        return date.toISOString().split('T')[0];
      }),
    end_date: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: 'End date must be a valid date' },
      )
      .transform((val) => {
        if (!val) return null;
        // Normalize to YYYY-MM-DD format
        const date = new Date(val);
        return date.toISOString().split('T')[0];
      })
      .nullable()
      .optional(),
    description: z.string().min(1, 'Description is required'),
    order_index: z.number().int().min(0, 'Order index must be 0 or greater'),
    is_visible: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.end_date) {
        return new Date(data.start_date) < new Date(data.end_date);
      }
      return true;
    },
    {
      message: 'Start date must be before end date',
      path: ['end_date'],
    },
  );

export type UpdateExperienceDto = z.infer<typeof updateExperienceSchema>;

/**
 * DTO interface for updating an experience
 * Matches API contract and Zod schema validation
 */
export class UpdateExperienceRequestDto {
  @ApiProperty({ description: 'Company name (minimum 2 characters)', example: 'Tech Corp' })
  company!: string;

  @ApiProperty({ description: 'Job role (minimum 2 characters)', example: 'Senior Developer' })
  role!: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)', example: '2020-01-01' })
  start_date!: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD), null for current role', example: '2022-12-31', nullable: true })
  end_date!: string | null;

  @ApiProperty({ description: 'Job description', example: 'Developed and maintained web applications' })
  description!: string;

  @ApiProperty({ description: 'Display order (0 or greater)', example: 0 })
  order_index!: number;

  @ApiProperty({ description: 'Visibility status', example: true })
  is_visible!: boolean;
}
