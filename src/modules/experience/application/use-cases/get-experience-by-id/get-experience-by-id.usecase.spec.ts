import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { GetExperienceByIdUseCase } from './get-experience-by-id.usecase';

describe('getExperienceById', () => {
  let tester: MemoryUseCaseTester;
  let getExperienceById: GetExperienceByIdUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    getExperienceById = new GetExperienceByIdUseCase(
      tester.experienceRepository,
    );
  });

  it('should retrieve an experience', async () => {
    const auth = await tester.signup();

    const { id } = await tester.createExperience({ userId: auth.user.id });

    const result = await getExperienceById.execute(id);
    expect(result).toEqual(
      expect.objectContaining({
        id,
        userId: auth.user.id,
      }),
    );
  });

  it('should throw an error if user does not exist', async () => {
    await expect(
      getExperienceById.execute(faker.string.uuid()),
    ).rejects.toThrow(NotFoundException);
  });
});
