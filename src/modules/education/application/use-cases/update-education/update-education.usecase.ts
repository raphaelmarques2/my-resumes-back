import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/modules/common/application/repositories/TransactionService';
import { EducationRepository } from '../../repositories/EducationRepository';
import {
  UpdateEducationDto,
  updateEducationDtoSchema,
} from './UpdateEducationDto';
import { EducationDto } from '../../entities/EducationDto';
import {
  validateDto,
  validateId,
} from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

@Injectable()
export class UpdateEducationUseCase {
  constructor(
    private transactionService: TransactionService,
    private educationRepository: EducationRepository,
  ) {}

  async execute(id: string, data: UpdateEducationDto): Promise<EducationDto> {
    validateId(id);
    validateDto(data, updateEducationDtoSchema);

    const updatedEducation = await this.transactionService.transaction(
      async (transaction) => {
        const education = await this.educationRepository.findById(new Id(id), {
          transaction,
        });
        if (!education) {
          throw new NotFoundException('Education not found');
        }

        education.update({
          title: this.convertName(data.title),
          institution: this.convertName(data.institution),
          startDate: this.convertDate(data.startDate),
          endDate: this.convertDate(data.endDate),
        });

        await this.educationRepository.update(education, { transaction });

        return education;
      },
    );
    return EducationDto.createFrom(updatedEducation);
  }

  private convertDate(input: string | undefined): Date | null | undefined {
    if (input === undefined) return undefined;
    if (input) return new Date(input);
    return null;
  }

  private convertName(input: string | undefined): Name | undefined {
    if (input === undefined) return undefined;
    return new Name(input);
  }
}
