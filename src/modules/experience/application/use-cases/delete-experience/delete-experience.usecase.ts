import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { validateId } from 'src/modules/common/application/validation';

@Injectable()
export class DeleteExperienceUseCase {
  constructor(private experienceRepository: ExperienceRepository) {}

  async execute(id: string): Promise<void> {
    validateId(id);

    await this.experienceRepository.delete(new Id(id));
  }
}
