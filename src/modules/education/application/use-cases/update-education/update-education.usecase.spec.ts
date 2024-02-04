import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { UpdateEducationUseCase } from './update-education.usecase';

describe('updateEducation', () => {
  let tester: MemoryUseCaseTester;
  let updateEducation: UpdateEducationUseCase;

  beforeAll(() => {
    tester = new MemoryUseCaseTester();
    updateEducation = new UpdateEducationUseCase(
      tester.transactionService,
      tester.educationRepository,
    );
  });

  it('should update an education with all fields', async () => {
    const auth = await tester.signup();
    const education = await tester.createEducation({ userId: auth.user.id });
    const startDate = new Date('2023-01-02').toISOString();
    const endDate = new Date('2023-01-03').toISOString();
    const updated = await updateEducation.execute(education.id, {
      title: 'title2',
      institution: 'institution2',
      startDate: startDate,
      endDate: endDate,
    });
    expect(updated).toEqual({
      id: expect.toBeUUID(),
      title: 'title2',
      institution: 'institution2',
      startDate: startDate,
      endDate: endDate,
      userId: auth.user.id,
    });
  });
  it('should update an education with one field', async () => {
    const auth = await tester.signup();
    const education = await tester.createEducation({ userId: auth.user.id });
    const updated = await updateEducation.execute(education.id, {
      title: 'title2',
    });
    expect(updated).toEqual(
      expect.objectContaining({
        title: 'title2',
      }),
    );
  });
  it('should update an education changing start-end dates', async () => {
    const auth = await tester.signup();
    const education = await tester.createEducation({ userId: auth.user.id });
    const startDate = new Date('2023-01-02').toISOString();
    const endDate = new Date('2023-01-03').toISOString();
    const updated1 = await updateEducation.execute(education.id, {
      startDate,
      endDate,
    });
    expect(updated1).toEqual(
      expect.objectContaining({
        startDate,
        endDate,
      }),
    );
    const updated2 = await updateEducation.execute(education.id, {
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

  it('should throw an error if education does not exist', async () => {
    await expect(
      updateEducation.execute(faker.string.uuid(), {}),
    ).rejects.toThrow(NotFoundException);
  });
});
