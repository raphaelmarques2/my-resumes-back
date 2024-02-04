import { BadRequestException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { CreateExperienceUseCase } from './create-experience.usecase';
import { CreateExperienceDto } from './CreateExperienceDto';
import { faker } from '@faker-js/faker';

describe('createExperience', () => {
  let tester: MemoryUseCaseTester;
  let createExperience: CreateExperienceUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    createExperience = new CreateExperienceUseCase(
      tester.userRepository,
      tester.experienceRepository,
    );
  });

  it('should create an experience without technologies', async () => {
    const auth = await tester.signup();
    const input: CreateExperienceDto = {
      title: 'title',
      company: 'abc',
      userId: auth.user.id,
    };
    const result = await createExperience.execute(input);
    expect(result).toEqual({
      id: expect.toBeUUID(),
      title: input.title,
      company: input.company,
      userId: input.userId,
      description: '',
      startDate: undefined,
      endDate: undefined,
    });
  });

  it('should throw an error if user does not exist', async () => {
    const input: CreateExperienceDto = {
      title: 'title',
      company: 'company',
      userId: faker.string.uuid(),
    };
    await expect(createExperience.execute(input)).rejects.toThrow(
      BadRequestException,
    );
  });
});
