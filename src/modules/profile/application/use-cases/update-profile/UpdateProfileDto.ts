import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateProfileDtoSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    linkedin: z.string().optional(),
  })
  .strict();

export class UpdateProfileDto extends createZodDto(updateProfileDtoSchema) {}
