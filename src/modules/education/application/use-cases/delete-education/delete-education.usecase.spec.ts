import { faker } from '@faker-js/faker';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { DeleteEducationUseCase } from './delete-education.usecase';

describe('deleteEducation', () => {
  let tester: MemoryUseCaseTester;
  let deleteEducation: DeleteEducationUseCase;

  beforeAll(() => {
    tester = new MemoryUseCaseTester();
    deleteEducation = new DeleteEducationUseCase(tester.educationRepository);
  });

  it('should delete an education out of resumes', async () => {
    const auth = await tester.signup();
    const education = await tester.createEducation({ userId: auth.user.id });
    await deleteEducation.execute(education.id);

    await expect(
      tester.educationRepository.findById(new Id(education.id)),
    ).resolves.toBe(null);
  });
  it('should throw error if education does not exist', async () => {
    await expect(
      deleteEducation.execute(faker.string.uuid()),
    ).resolves.not.toThrow();
  });
});
