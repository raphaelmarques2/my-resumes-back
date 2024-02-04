import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { passwordSchema } from '../signup/signup.dto';

export const updatePasswordByResetTokenDtoSchema = z
  .object({
    token: z.string().uuid(),
    password: passwordSchema,
  })
  .strict();

export class UpdatePasswordByResetTokenDto extends createZodDto(
  updatePasswordByResetTokenDtoSchema,
) {}
