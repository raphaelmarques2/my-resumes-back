import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Resume } from './Resume.entity';

export const resumeDtoSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string().min(1),
    title: z.string().min(1),
    description: z.string(),
    experiences: z.array(z.string()),
    educations: z.array(z.string()),
    updatedAt: z.string(),
  })
  .strict();

export class ResumeDto extends createZodDto(resumeDtoSchema) {
  static createFrom(resume: Resume): ResumeDto {
    return ResumeDto.create({
      id: resume.id.value,
      userId: resume.userId.value,
      name: resume.name.value,
      title: resume.title.value,
      description: resume.description,
      experiences: resume.experiences.map((item) => item.value),
      educations: resume.educations.map((item) => item.value),
      updatedAt: resume.updatedAt.toISOString(),
    } satisfies ResumeDto);
  }
}
