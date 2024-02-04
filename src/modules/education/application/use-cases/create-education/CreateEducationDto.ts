import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createEducationDtoSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict();
export class CreateEducationDto extends createZodDto(
  createEducationDtoSchema,
) {}
