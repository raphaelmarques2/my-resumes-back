import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateResumeDtoSchema = z
  .object({
    name: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    experiences: z.array(z.string().uuid()).optional(),
    educations: z.array(z.string().uuid()).optional(),
  })
  .strict();

export class UpdateResumeDto extends createZodDto(updateResumeDtoSchema) {}
