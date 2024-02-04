import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/auth/application/entities/User.entity';
import { UserRepository } from 'src/modules/auth/application/repositories/UserRepository';
import { TransactionService } from 'src/modules/common/application/repositories/TransactionService';
import { validateDto } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { Education } from 'src/modules/education/application/entities/Education.entity';
import { EducationRepository } from 'src/modules/education/application/repositories/EducationRepository';
import { Experience } from 'src/modules/experience/application/entities/Experience.entity';
import { ExperienceRepository } from 'src/modules/experience/application/repositories/ExperienceRepository';
import { Resume } from 'src/modules/resume/application/entities/Resume.entity';
import { ResumeRepository } from 'src/modules/resume/application/repositories/ResumeRepository';
import { createResumeDtoSchema } from '../create-resume/CreateResumeDto';
import { CreateResumeExampleDto } from './CreateResumeExampleDto';

@Injectable()
export class CreateResumeExampleUseCase {
  constructor(
    private transactionService: TransactionService,
    private userRepository: UserRepository,
    private educationRepository: EducationRepository,
    private experienceRepository: ExperienceRepository,
    private resumeRepository: ResumeRepository,
  ) {}

  async execute(input: CreateResumeExampleDto): Promise<void> {
    validateDto(input, createResumeDtoSchema);

    const user = await this.userRepository.findById(new Id(input.userId));
    if (!user) throw new BadRequestException('Invalid userId');

    const educations = this.createEducations(user);
    const experiences = this.createExperiences(user);
    const resumes = this.createResumes({ educations, experiences, user });

    await this.save({ educations, experiences, resumes });
  }

  private createEducations(user: User) {
    const education1 = Education.create({
      userId: user.id,
      title: new Name('Computer Science'),
      institution: new Name('University of Computer Science'),
      startDate: new Date('2015-01-01'),
      endDate: new Date('2019-01-01'),
    });
    const education2 = Education.create({
      userId: user.id,
      title: new Name('Computer Engineering'),
      institution: new Name('University of Computer Engineering'),
      startDate: new Date('2015-01-01'),
      endDate: new Date('2019-01-01'),
    });
    return [education1, education2];
  }

  private createExperiences(user: User) {
    const experience1 = Experience.create({
      userId: user.id,
      title: new Name('Software Engineer'),
      company: new Name('Google'),
      description: 'Worked on Google Search',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-01-01'),
    });
    const experience2 = Experience.create({
      userId: user.id,
      title: new Name('Software Engineer'),
      company: new Name('Facebook'),
      description: 'Worked on Facebook Search',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-01-01'),
    });
    const experience3 = Experience.create({
      userId: user.id,
      title: new Name('Software Engineer'),
      company: new Name('Apple'),
      description: 'Worked on Apple Search',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-01-01'),
    });
    const experience4 = Experience.create({
      userId: user.id,
      title: new Name('Software Engineer'),
      company: new Name('Microsoft'),
      description: 'Worked on Microsoft Search',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-01-01'),
    });
    return [experience1, experience2, experience3, experience4];
  }

  private createResumes({
    educations,
    experiences,
    user,
  }: {
    educations: Education[];
    experiences: Experience[];
    user: User;
  }) {
    const resume1 = Resume.create({
      userId: user.id,
      name: new Name('Full resume'),
      description: 'Software Engineer',
      title: new Name('Software Engineer'),
      educations: educations.map((education) => education.id),
      experiences: experiences.map((experience) => experience.id),
    });
    const resume2 = Resume.create({
      userId: user.id,
      name: new Name('Software Engineer'),
      description: 'Software Engineer',
      title: new Name('Software Engineer'),
      educations: educations.map((education) => education.id),
      experiences: [2, 3].map((i) => experiences[i].id),
    });
    return [resume1, resume2];
  }

  private async save({
    educations,
    experiences,
    resumes,
  }: {
    educations: Education[];
    experiences: Experience[];
    resumes: Resume[];
  }) {
    await this.transactionService.transaction(async (transaction) => {
      for (const education of educations) {
        await this.educationRepository.add(education, { transaction });
      }
      for (const experience of experiences) {
        await this.experienceRepository.add(experience, { transaction });
      }
      for (const resume of resumes) {
        await this.resumeRepository.add(resume, { transaction });
      }
    });
  }
}
