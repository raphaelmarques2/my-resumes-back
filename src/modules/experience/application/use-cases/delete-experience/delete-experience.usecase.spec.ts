import { faker } from '@faker-js/faker';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { DeleteExperienceUseCase } from './delete-experience.usecase';

describe('deleteExperience', () => {
  let tester: MemoryUseCaseTester;
  let deleteExperience: DeleteExperienceUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    deleteExperience = new DeleteExperienceUseCase(tester.experienceRepository);
  });

  it('should delete an experience', async () => {
    const auth = await tester.signup();
    const experience = await tester.createExperience({ userId: auth.user.id });

    await deleteExperience.execute(experience.id);

    await expect(
      tester.experienceRepository.findById(new Id(experience.id)),
    ).resolves.toBe(null);
  });

  it('should delete if experience does not exist', async () => {
    await expect(
      deleteExperience.execute(faker.string.uuid()),
    ).resolves.not.toThrowError();
  });
});
