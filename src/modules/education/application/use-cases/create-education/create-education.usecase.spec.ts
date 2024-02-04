import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { CreateEducationDto } from './CreateEducationDto';
import { CreateEducationUseCase } from './create-education.usecase';

describe('createEducation', () => {
  let tester: MemoryUseCaseTester;
  let createEducation: CreateEducationUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    createEducation = new CreateEducationUseCase(
      tester.userRepository,
      tester.educationRepository,
    );
  });
  it('should create an education without dates', async () => {
    const auth = await tester.signup();
    const input: CreateEducationDto = {
      userId: auth.user.id,
    };
    const result = await createEducation.execute(input);
    expect(result).toEqual({
      id: expect.toBeUUID(),
      title: 'Title',
      institution: 'Institution',
      userId: input.userId,
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('should throw an error if user does not exist', async () => {
    const input: CreateEducationDto = {
      userId: faker.string.uuid(),
    };
    await expect(createEducation.execute(input)).rejects.toThrow(
      BadRequestException,
    );
  });
});
