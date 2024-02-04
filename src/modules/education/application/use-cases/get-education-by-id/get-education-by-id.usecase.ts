import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository } from '../../repositories/EducationRepository';
import { EducationDto } from '../../entities/EducationDto';
import { validateId } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class GetEducationByIdUseCase {
  constructor(private educationRepository: EducationRepository) {}

  async execute(id: string): Promise<EducationDto> {
    validateId(id);

    const education = await this.educationRepository.findById(new Id(id));
    if (!education) throw new NotFoundException('Education not found');

    return EducationDto.createFrom(education);
  }
}
