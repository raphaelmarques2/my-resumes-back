import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { UpdateResumeDto } from './UpdateResumeDto';
import { UpdateResumeUseCase } from './update-resume.usecase';

describe('updateResume', () => {
  let tester: MemoryUseCaseTester;
  let updateResume: UpdateResumeUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    updateResume = new UpdateResumeUseCase(
      tester.transactionService,
      tester.resumeRepository,
    );
  });

  it('should update resume properties', async () => {
    const auth = await tester.signup();
    const resume = await tester.createResume({
      userId: auth.user.id,
    });

    const input: UpdateResumeDto = {
      title: 'title2',
      description: 'description2',
    };
    const updatedResume = await updateResume.execute(resume.id, input);

    expect(updatedResume).toEqual(
      expect.objectContaining({
        title: input.title,
        description: input.description,
        experiences: [],
      }),
    );
  });
  it('should update resume experiences', async () => {
    const auth = await tester.signup();
    const experiences = [
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
    ].map((e) => e.id);

    const experiencesBefore = [1, 2, 3].map((i) => experiences[i]);
    const experiencesAfter = [4, 3, 0].map((i) => experiences[i]);

    const resume = await tester.createResume({
      userId: auth.user.id,
      experiences: experiencesBefore,
    });

    const input: UpdateResumeDto = {
      experiences: experiencesAfter,
    };
    const updatedResume = await updateResume.execute(resume.id, input);
    expect(updatedResume).toEqual(
      expect.objectContaining({
        title: resume.title,
        description: resume.description,
        experiences: experiencesAfter,
      }),
    );
  });

  it('should throw error if resume does not exist', async () => {
    await expect(updateResume.execute(faker.string.uuid(), {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
