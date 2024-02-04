import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginDtoSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(3),
  })
  .strict();

export class LoginDto extends createZodDto(loginDtoSchema) {}
