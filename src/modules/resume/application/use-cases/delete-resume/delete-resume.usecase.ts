import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { validateId } from '../../../../common/application/validation';
import { ResumeRepository } from '../../repositories/ResumeRepository';

@Injectable()
export class DeleteResumeUseCase {
  constructor(private resumeRepository: ResumeRepository) {}

  async execute(id: string): Promise<void> {
    validateId(id);

    await this.resumeRepository.delete(new Id(id));
  }
}
