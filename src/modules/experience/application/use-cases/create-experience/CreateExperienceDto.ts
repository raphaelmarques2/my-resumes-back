import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createExperienceDtoSchema = z
  .object({
    userId: z.string().uuid(),
    title: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
  })
  .strict();

export class CreateExperienceDto extends createZodDto(
  createExperienceDtoSchema,
) {}
