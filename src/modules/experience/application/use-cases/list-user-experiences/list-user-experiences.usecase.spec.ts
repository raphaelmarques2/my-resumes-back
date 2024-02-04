import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { ListUserExperiencesUseCase } from './list-user-experiences.usecase';

describe('listUserExperiences', () => {
  let tester: MemoryUseCaseTester;
  let listUserExperiences: ListUserExperiencesUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    listUserExperiences = new ListUserExperiencesUseCase(
      tester.experienceRepository,
    );
  });

  it('should retrieve user experiences', async () => {
    const auth = await tester.signup();
    const experienceA = await tester.createExperience({ userId: auth.user.id });
    const experienceB = await tester.createExperience({ userId: auth.user.id });
    const experienceC = await tester.createExperience({ userId: auth.user.id });

    const result = await listUserExperiences.execute(auth.user.id);
    expect(result).toHaveLength(3);

    const resultA = result.find((e) => e.id === experienceA.id);
    const resultB = result.find((e) => e.id === experienceB.id);
    const resultC = result.find((e) => e.id === experienceC.id);

    expect(resultA).toEqual(experienceA);
    expect(resultB).toEqual(experienceB);
    expect(resultC).toEqual(experienceC);
  });

  it('should not return experiences from other users', async () => {
    const authA = await tester.signup();
    const authB = await tester.signup();

    await tester.createExperience({ userId: authA.user.id });
    await tester.createExperience({ userId: authB.user.id });
    await tester.createExperience({ userId: authA.user.id });
    await tester.createExperience({ userId: authB.user.id });
    await tester.createExperience({ userId: authA.user.id });

    const resultA = await listUserExperiences.execute(authA.user.id);
    const resultB = await listUserExperiences.execute(authB.user.id);

    expect(resultA).toHaveLength(3);
    expect(resultB).toHaveLength(2);
  });

  it('should return empty array if user has no experience', async () => {
    const auth = await tester.signup();
    const result = await listUserExperiences.execute(auth.user.id);
    expect(result).toHaveLength(0);
  });
});
