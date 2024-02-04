import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Profile } from './Profile.entity';

export const profileDtoSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
    address: z.string().optional(),
    linkedin: z.string().optional(),
  })
  .strict();

export class ProfileDto extends createZodDto(profileDtoSchema) {
  static createFrom(profile: Profile): ProfileDto {
    return ProfileDto.create({
      id: profile.id.value,
      userId: profile.userId.value,
      name: profile.name,
      email: profile.email,
      address: profile.address ?? undefined,
      linkedin: profile.linkedin ?? undefined,
    } satisfies ProfileDto);
  }
}
