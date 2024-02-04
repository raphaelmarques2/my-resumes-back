import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateEducationDto,
  createEducationDtoSchema,
} from './CreateEducationDto';
import { EducationDto } from '../../entities/EducationDto';
import { validateDto } from 'src/modules/common/application/validation';
import { UserRepository } from 'src/modules/auth/application/repositories/UserRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Education } from '../../entities/Education.entity';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { EducationRepository } from '../../repositories/EducationRepository';

@Injectable()
export class CreateEducationUseCase {
  constructor(
    private userRepository: UserRepository,
    private educationRepository: EducationRepository,
  ) {}

  async execute(data: CreateEducationDto): Promise<EducationDto> {
    validateDto(data, createEducationDtoSchema);

    const userExists = await this.userRepository.userExists(
      new Id(data.userId),
    );
    if (!userExists) throw new BadRequestException('Invalid userId');

    const education = Education.create({
      userId: new Id(data.userId),
      title: new Name('Title'),
      institution: new Name('Institution'),
      startDate: null,
      endDate: null,
    });

    await this.educationRepository.add(education);

    return EducationDto.createFrom(education);
  }
}
