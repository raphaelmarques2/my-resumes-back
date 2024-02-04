import { createZodDto } from 'nestjs-zod';
import { userDtoSchema } from 'src/modules/auth/application/entities/User.dto';
import { z } from 'zod';

export const authOutputDtoSchema = z
  .object({
    token: z.string(),
    user: userDtoSchema,
  })
  .strict();

export class AuthOutputDto extends createZodDto(authOutputDtoSchema) {}
