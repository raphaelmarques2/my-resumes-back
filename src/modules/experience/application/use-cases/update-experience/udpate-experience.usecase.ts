import { Injectable, NotFoundException } from '@nestjs/common';
import {
  validateId,
  validateDto,
} from 'src/modules/common/application/validation';
import { ExperienceDto } from '../../entities/ExperienceDto';
import {
  UpdateExperienceDto,
  updateExperienceDtoSchema,
} from './UpdateExperienceDto';
import { TransactionService } from 'src/modules/common/application/repositories/TransactionService';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

@Injectable()
export class UpdateExperienceUseCase {
  constructor(
    private transactionService: TransactionService,
    private experienceRepository: ExperienceRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateExperienceDto,
  ): Promise<ExperienceDto> {
    validateId(id);
    validateDto(input, updateExperienceDtoSchema);

    const updatedExperience = await this.transactionService.transaction(
      async (transaction) => {
        const experience = await this.experienceRepository.findById(
          new Id(id),
          { transaction },
        );

        if (!experience) {
          throw new NotFoundException('Experience not found');
        }

        experience.update({
          title: this.convertName(input.title),
          company: this.convertName(input.company),
          description: input.description,
          startDate: this.convertDate(input.startDate),
          endDate: this.convertDate(input.endDate),
        });

        await this.experienceRepository.update(experience, { transaction });

        return experience;
      },
    );

    return ExperienceDto.createFrom(updatedExperience);
  }

  private convertDate(input: string | undefined): Date | undefined | null {
    if (input === undefined) return undefined;
    if (input) return new Date(input);
    return null;
  }
  private convertName(input: string | undefined): Name | undefined {
    if (input === undefined) return undefined;
    return new Name(input);
  }
}
