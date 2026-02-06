import { z } from 'zod';
import { createAboutSchema } from './create-about.dto';

export const updateAboutSchema = createAboutSchema.partial();

export type UpdateAboutDto = z.infer<typeof updateAboutSchema>;
