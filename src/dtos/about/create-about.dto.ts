import { z } from 'zod';

export const createAboutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  title: z.string().min(1, 'Title is required').max(255),
  shortIntro: z.string().nullable().optional(),
  description: z.array(z.string()).nullable().optional(),
  yearsOfExperience: z.number().int().nonnegative().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type CreateAboutDto = z.infer<typeof createAboutSchema>;
