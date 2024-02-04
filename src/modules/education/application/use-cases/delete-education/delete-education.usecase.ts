import { Injectable } from '@nestjs/common';
import { EducationRepository } from '../../repositories/EducationRepository';
import { validateId } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class DeleteEducationUseCase {
  constructor(private educationRepository: EducationRepository) {}

  async execute(id: string): Promise<void> {
    validateId(id);

    await this.educationRepository.delete(new Id(id));
  }
}
