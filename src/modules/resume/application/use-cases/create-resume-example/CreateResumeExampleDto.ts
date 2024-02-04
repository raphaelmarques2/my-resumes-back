import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createResumeExampleDtoSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict();

export class CreateResumeExampleDto extends createZodDto(
  createResumeExampleDtoSchema,
) {}
