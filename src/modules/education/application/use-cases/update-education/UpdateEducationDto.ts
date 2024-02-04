import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateEducationDtoSchema = z
  .object({
    title: z.string().min(1).optional(),
    institution: z.string().min(1).optional(),
    startDate: z.string().datetime().optional().or(z.string().length(0)),
    endDate: z.string().datetime().optional().or(z.string().length(0)),
  })
  .strict();
export class UpdateEducationDto extends createZodDto(
  updateEducationDtoSchema,
) {}
