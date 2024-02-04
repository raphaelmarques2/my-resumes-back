import { faker } from '@faker-js/faker';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { DeleteResumeUseCase } from './delete-resume.usecase';

describe('deleteResume', () => {
  let tester: MemoryUseCaseTester;
  let deleteResume: DeleteResumeUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    deleteResume = new DeleteResumeUseCase(tester.resumeRepository);
  });

  it('should delete a resume without experiences', async () => {
    const auth = await tester.signup();
    const resume = await tester.createResume({ userId: auth.user.id });

    await deleteResume.execute(resume.id);

    expect(await tester.resumeRepository.findById(new Id(resume.id))).toBe(
      null,
    );
  });
  it('should delete a resume with experiences', async () => {
    const auth = await tester.signup();
    const experiences = [
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
      await tester.createExperience({ userId: auth.user.id }),
    ].map((e) => e.id);

    const resume = await tester.createResume({
      userId: auth.user.id,
      experiences,
    });
    await deleteResume.execute(resume.id);

    expect(await tester.resumeRepository.findById(new Id(resume.id))).toBe(
      null,
    );
  });
  it('should not return error if the resume does not exist', async () => {
    await expect(
      deleteResume.execute(faker.string.uuid()),
    ).resolves.not.toThrow();
  });
});
