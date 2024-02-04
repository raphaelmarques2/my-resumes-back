import { Injectable, NotFoundException } from '@nestjs/common';
import { validateId } from '../../../../common/application/validation';
import { ResumeDto } from '../../entities/ResumeDto';
import { ResumeRepository } from '../../repositories/ResumeRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class GetResumeByIdUseCase {
  constructor(private resumeRepository: ResumeRepository) {}

  async execute(id: string): Promise<ResumeDto> {
    validateId(id);

    const resume = await this.resumeRepository.findById(new Id(id));
    if (!resume) {
      throw new NotFoundException();
    }

    return ResumeDto.createFrom(resume);
  }
}
