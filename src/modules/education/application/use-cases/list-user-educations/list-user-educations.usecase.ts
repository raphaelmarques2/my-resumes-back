import { Injectable } from '@nestjs/common';
import { EducationRepository } from '../../repositories/EducationRepository';
import { EducationDto } from '../../entities/EducationDto';
import { validateId } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class ListUserEducationsUseCase {
  constructor(private educationRepository: EducationRepository) {}

  async execute(userId: string): Promise<EducationDto[]> {
    validateId(userId);

    const educations = await this.educationRepository.listByUserId(
      new Id(userId),
    );

    return educations.map((e) => EducationDto.createFrom(e));
  }
}
