import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createResumeDtoSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict();

export class CreateResumeDto extends createZodDto(createResumeDtoSchema) {}
