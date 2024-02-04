import { UserRepository } from 'src/modules/auth/application/repositories/UserRepository';
import { CreateExperienceDto } from './CreateExperienceDto';
import { ExperienceRepository } from '../../repositories/ExperienceRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Experience } from '../../entities/Experience.entity';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { ExperienceDto } from '../../entities/ExperienceDto';

@Injectable()
export class CreateExperienceUseCase {
  constructor(
    private userRepository: UserRepository,
    private experienceRepository: ExperienceRepository,
  ) {}

  async execute(input: CreateExperienceDto): Promise<ExperienceDto> {
    const userExists = await this.userRepository.userExists(
      new Id(input.userId),
    );
    if (!userExists) throw new BadRequestException('Invalid userId');

    const experience = Experience.create({
      userId: new Id(input.userId),
      title: new Name(input.title ?? 'Title'),
      company: new Name(input.company ?? 'Company'),
    });

    await this.experienceRepository.add(experience);

    return ExperienceDto.createFrom(experience);
  }
}
