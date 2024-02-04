import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { validateId } from '../../../../common/application/validation';
import { ResumeDto } from '../../entities/ResumeDto';
import { ResumeRepository } from '../../repositories/ResumeRepository';

@Injectable()
export class ListUserResumesUseCase {
  constructor(private resumeRepository: ResumeRepository) {}

  async execute(userId: string): Promise<ResumeDto[]> {
    validateId(userId);

    const resumes = await this.resumeRepository.listByUserId(new Id(userId));

    return resumes.map((item) => ResumeDto.createFrom(item));
  }
}
