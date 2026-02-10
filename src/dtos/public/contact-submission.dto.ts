import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
});

export type ContactSubmissionDto = z.infer<typeof contactSubmissionSchema>;

