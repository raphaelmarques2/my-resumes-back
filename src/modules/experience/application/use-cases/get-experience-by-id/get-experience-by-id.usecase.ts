import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { ExperienceDto } from '../../entities/ExperienceDto';
import { validateId } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class GetExperienceByIdUseCase {
  constructor(private experienceRepository: ExperienceRepository) {}

  async execute(id: string): Promise<ExperienceDto> {
    validateId(id);

    const experience = await this.experienceRepository.findById(new Id(id));
    if (!experience) throw new NotFoundException('Experience not found');

    return ExperienceDto.createFrom(experience);
  }
}
