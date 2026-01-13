import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export class LoginRequestDto {
  @ApiProperty({
    description: 'Admin user email address',
    example: 'admin@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Admin user password',
    example: 'SecurePassword123!',
    type: String,
    format: 'password',
  })
  password: string;
}
