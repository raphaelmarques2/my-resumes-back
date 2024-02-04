import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const requestPasswordResetDtoSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export class RequestPasswordResetDto extends createZodDto(
  requestPasswordResetDtoSchema,
) {}
