import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Experience } from './Experience.entity';

export const experienceDtoSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string().min(1),
    company: z.string().min(1),
    description: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .strict();

export class ExperienceDto extends createZodDto(experienceDtoSchema) {
  static createFrom(experience: Experience): ExperienceDto {
    return ExperienceDto.create({
      id: experience.id.value,
      userId: experience.userId.value,
      title: experience.title.value,
      company: experience.company.value,
      description: experience.description,
      startDate: experience.startDate?.toISOString(),
      endDate: experience.endDate?.toISOString(),
    } satisfies ExperienceDto);
  }
}
