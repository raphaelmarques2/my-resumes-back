import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenService } from 'src/modules/auth/application/services/AuthTokenService';
import { PasswordService } from 'src/modules/auth/application/services/PasswordService';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';
import { LoginDto } from 'src/modules/auth/application/use-cases/login/login.dto';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login/login.usecase';
import { SignupDto } from 'src/modules/auth/application/use-cases/signup/signup.dto';
import { SignupUseCase } from 'src/modules/auth/application/use-cases/signup/signup.usecase';
import { MemoryCredentialRepository } from 'src/modules/auth/infra/repositories/MemoryCredentialRepository';
import { MemoryUserRepository } from 'src/modules/auth/infra/repositories/MemoryUserRepository';
import { MemoryExperienceRepository } from 'src/modules/experience/infra/repositories/MemoryExperienceRepository';
import { MemoryProfileRepository } from 'src/modules/profile/infra/repositories/MemoryProfileRepository';
import { MemoryTransactionService } from '../infra/repositories/MemoryTransactionService';
import { Experience } from 'src/modules/experience/application/entities/Experience.entity';
import { ExperienceDto } from 'src/modules/experience/application/entities/ExperienceDto';
import { MemoryEducationRepository } from 'src/modules/education/infra/repositories/MemoryEducationRepository';
import { Education } from 'src/modules/education/application/entities/Education.entity';
import { EducationDto } from 'src/modules/education/application/entities/EducationDto';
import { MemoryResumeRepository } from 'src/modules/resume/infra/repositories/MemoryResumeRepository';
import { Resume } from 'src/modules/resume/application/entities/Resume.entity';
import { ResumeDto } from 'src/modules/resume/application/entities/ResumeDto';
import { Id } from '../application/value-objects/Id';
import { Name } from '../application/value-objects/Name';
import { MemoryEmailService } from '../infra/services/MemoryEmailService';
import { MemoryResetPasswordRequestRepository } from 'src/modules/auth/infra/repositories/MemoryResetPasswordRequestRepository';

export class MemoryUseCaseTester {
  services: Map<unknown, unknown>;

  constructor() {
    this.services = new Map<unknown, unknown>();
  }

  private getOrCreate<T>(key: new (any) => T, fn?: () => T): T {
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    } else {
      const value = fn ? fn() : new key(undefined);
      this.services.set(key, value);
      return value;
    }
  }

  get jwtService() {
    return this.getOrCreate(
      JwtService,
      () => new JwtService({ secret: 'test' }),
    );
  }

  get authTokenService() {
    return this.getOrCreate(
      AuthTokenService,
      () => new AuthTokenService(this.jwtService),
    );
  }

  get passwordService() {
    return this.getOrCreate(PasswordService);
  }

  get transactionService() {
    return this.getOrCreate(MemoryTransactionService);
  }

  get userRepository() {
    return this.getOrCreate(MemoryUserRepository);
  }
  get credentialRepository() {
    return this.getOrCreate(MemoryCredentialRepository);
  }
  get profileRepository() {
    return this.getOrCreate(MemoryProfileRepository);
  }
  get experienceRepository() {
    return this.getOrCreate(MemoryExperienceRepository);
  }
  get educationRepository() {
    return this.getOrCreate(MemoryEducationRepository);
  }
  get resumeRepository() {
    return this.getOrCreate(MemoryResumeRepository);
  }
  get resetPasswordRequestRepository() {
    return this.getOrCreate(MemoryResetPasswordRequestRepository);
  }

  get emailService() {
    return this.getOrCreate(MemoryEmailService);
  }

  async signup(override?: Partial<SignupDto>): Promise<AuthOutputDto> {
    const signupDto: SignupDto = {
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...(override ?? {}),
    };

    //example data will break all tests
    const signup = new SignupUseCase(
      this.transactionService,
      this.userRepository,
      this.credentialRepository,
      this.profileRepository,
      this.passwordService,
      this.authTokenService,
    );

    return await signup.execute(signupDto);
  }

  async login(input: LoginDto) {
    const login = new LoginUseCase(
      this.userRepository,
      this.credentialRepository,
      this.passwordService,
      this.authTokenService,
    );
    return await login.execute(input);
  }

  async createExperience(input: { userId: string }): Promise<ExperienceDto> {
    const experience = Experience.load({
      id: new Id(),
      title: new Name(faker.internet.domainWord()),
      company: new Name(faker.internet.displayName()),
      description: faker.lorem.paragraph(),
      startDate: faker.date.past({ years: 3 }),
      endDate: faker.date.past({ years: 2 }),
      userId: new Id(input.userId),
    });
    await this.experienceRepository.add(experience);

    return ExperienceDto.createFrom(experience);
  }

  async createResume(input: {
    userId: string;
    experiences?: string[];
    educations?: string[];
  }) {
    const resume = Resume.load({
      id: new Id(),
      userId: new Id(input.userId),
      name: new Name(faker.internet.userName()),
      title: new Name(faker.lorem.word()),
      description: faker.lorem.paragraph(),
      experiences: input.experiences
        ? input.experiences.map((e) => new Id(e))
        : [],
      educations: input.educations
        ? input.educations.map((e) => new Id(e))
        : [],
      updatedAt: new Date(),
    });
    await this.resumeRepository.add(resume);
    return ResumeDto.createFrom(resume);
  }

  async createEducation(input: { userId: string }) {
    const education = Education.load({
      id: new Id(),
      userId: new Id(input.userId),
      title: new Name(faker.lorem.word()),
      institution: new Name(faker.lorem.word()),
      startDate: faker.date.past({ years: 7 }),
      endDate: faker.date.past({ years: 2 }),
    });
    await this.educationRepository.add(education);
    return EducationDto.createFrom(education);
  }
}
