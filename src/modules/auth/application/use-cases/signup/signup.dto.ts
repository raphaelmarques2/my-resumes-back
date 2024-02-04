import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const passwordSchema = z.string().min(3);

export const signupDtoSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: passwordSchema,
  })
  .strict();

export class SignupDto extends createZodDto(signupDtoSchema) {}
