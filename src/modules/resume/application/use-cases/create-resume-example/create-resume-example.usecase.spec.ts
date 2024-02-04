import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { CreateResumeExampleUseCase } from './create-resume-example.usecase';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';

describe('CreateResumeExample', () => {
  let tester: MemoryUseCaseTester;
  let createResumeExample: CreateResumeExampleUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    createResumeExample = new CreateResumeExampleUseCase(
      tester.transactionService,
      tester.userRepository,
      tester.educationRepository,
      tester.experienceRepository,
      tester.resumeRepository,
    );
  });

  it('should create resume example', async () => {
    const auth = await tester.signup();
    await createResumeExample.execute({ userId: auth.user.id });

    const userId = new Id(auth.user.id);

    const educations = await tester.educationRepository.listByUserId(userId);
    const experiences = await tester.experienceRepository.listByUserId(userId);
    const resumes = await tester.resumeRepository.listByUserId(userId);

    expect(educations).toHaveLength(2);
    expect(experiences).toHaveLength(4);
    expect(resumes).toHaveLength(2);

    expect(resumes[0].educations).toHaveLength(2);
    expect(resumes[1].educations).toHaveLength(2);

    expect(resumes[0].experiences).toHaveLength(4);
    expect(resumes[1].experiences).toHaveLength(2);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      createResumeExample.execute({ userId: faker.string.uuid() }),
    ).rejects.toThrow(BadRequestException);
  });
});
