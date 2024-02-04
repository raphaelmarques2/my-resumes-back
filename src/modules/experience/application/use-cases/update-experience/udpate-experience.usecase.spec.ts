import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { UpdateExperienceUseCase } from './udpate-experience.usecase';

describe('updateExperience', () => {
  let tester: MemoryUseCaseTester;
  let updateExperience: UpdateExperienceUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    updateExperience = new UpdateExperienceUseCase(
      tester.transactionService,
      tester.experienceRepository,
    );
  });
  it('should update an experience with all fields', async () => {
    const auth = await tester.signup();
    const experience = await tester.createExperience({ userId: auth.user.id });

    const startDate = new Date('2023-01-02').toISOString();
    const endDate = new Date('2023-01-03').toISOString();

    const updated = await updateExperience.execute(experience.id, {
      title: 'title2',
      company: 'company2',
      description: 'description2',
      startDate: startDate,
      endDate: endDate,
    });
    expect(updated).toEqual({
      id: expect.toBeUUID(),
      title: 'title2',
      company: 'company2',
      description: 'description2',
      startDate: startDate,
      endDate: endDate,
      userId: auth.user.id,
    });
  });
  it('should update an experience with one field', async () => {
    const auth = await tester.signup();
    const experience = await tester.createExperience({ userId: auth.user.id });
    const updated = await updateExperience.execute(experience.id, {
      title: 'title2',
    });
    expect(updated.title).toBe('title2');
  });
  it('should update an experience changing start-end dates', async () => {
    const auth = await tester.signup();
    const experience = await tester.createExperience({ userId: auth.user.id });
    const startDate = new Date('2023-01-02').toISOString();
    const endDate = new Date('2023-01-03').toISOString();
    const updated1 = await updateExperience.execute(experience.id, {
      startDate,
      endDate,
    });
    expect(updated1).toEqual(
      expect.objectContaining({
        startDate,
        endDate,
      }),
    );
    const updated2 = await updateExperience.execute(experience.id, {
      startDate: '',
      endDate: '',
    });
    expect(updated2).toEqual(
      expect.objectContaining({
        startDate: undefined,
        endDate: undefined,
      }),
    );
  });

  it('should throw an error if experience does not exist', async () => {
    await expect(
      updateExperience.execute(faker.string.uuid(), {}),
    ).rejects.toThrow(NotFoundException);
  });
});
