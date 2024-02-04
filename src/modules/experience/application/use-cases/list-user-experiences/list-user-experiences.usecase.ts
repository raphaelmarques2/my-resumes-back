import { validateId } from 'src/modules/common/application/validation';
import { ExperienceDto } from '../../entities/ExperienceDto';
import { Injectable } from '@nestjs/common';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class ListUserExperiencesUseCase {
  constructor(private experienceRepository: ExperienceRepository) {}

  async execute(userId: string): Promise<ExperienceDto[]> {
    validateId(userId);

    const experiences = await this.experienceRepository.listByUserId(
      new Id(userId),
    );

    return experiences.map((e) => ExperienceDto.createFrom(e));
  }
}
