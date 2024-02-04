import { createZodDto } from 'nestjs-zod';
import { emailSchema } from 'src/modules/common/application/value-objects/Email';
import { idSchema } from 'src/modules/common/application/value-objects/Id';
import { nameSchema } from 'src/modules/common/application/value-objects/Name';
import { z } from 'zod';
import { User } from './User.entity';

export const userDtoSchema = z
  .object({
    id: idSchema,
    name: nameSchema,
    email: emailSchema,
  })
  .strict();

export class UserDto extends createZodDto(userDtoSchema) {
  static createFrom(user: User): UserDto {
    return UserDto.create({
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
    } satisfies UserDto);
  }
}
