import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/modules/common/application/repositories/TransactionService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import {
  validateDto,
  validateId,
} from '../../../../common/application/validation';
import { ResumeDto } from '../../entities/ResumeDto';
import { ResumeRepository } from '../../repositories/ResumeRepository';
import { UpdateResumeDto, updateResumeDtoSchema } from './UpdateResumeDto';

@Injectable()
export class UpdateResumeUseCase {
  constructor(
    private transactionService: TransactionService,
    private resumeRepository: ResumeRepository,
  ) {}

  async execute(userId: string, data: UpdateResumeDto): Promise<ResumeDto> {
    validateId(userId);
    validateDto(data, updateResumeDtoSchema);

    const updatedResume = await this.transactionService.transaction(
      async (transaction) => {
        const resume = await this.resumeRepository.findById(new Id(userId), {
          transaction,
        });
        if (!resume) {
          throw new NotFoundException();
        }

        resume.update({
          name: this.convertName(data.name),
          title: this.convertName(data.title),
          description: data.description,
          experiences: this.convertExperiences(data.experiences),
          educations: this.convertEducations(data.educations),
        });

        await this.resumeRepository.update(resume, { transaction });

        return resume;
      },
    );

    return ResumeDto.createFrom(updatedResume);
  }

  private convertName(value: string | undefined): Name | undefined {
    if (value === undefined) return undefined;
    return new Name(value);
  }
  private convertExperiences(
    experiences: string[] | undefined,
  ): Id[] | undefined {
    if (experiences === undefined) return undefined;
    return experiences.map((e) => new Id(e));
  }
  private convertEducations(
    educations: string[] | undefined,
  ): Id[] | undefined {
    if (educations === undefined) return undefined;
    return educations.map((e) => new Id(e));
  }
}
