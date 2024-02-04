import { faker } from '@faker-js/faker';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { ListUserEducationsUseCase } from './list-user-educations.usecase';

describe('listUserEducations', () => {
  let tester: MemoryUseCaseTester;
  let listUserEducations: ListUserEducationsUseCase;

  beforeAll(() => {
    tester = new MemoryUseCaseTester();
    listUserEducations = new ListUserEducationsUseCase(
      tester.educationRepository,
    );
  });

  it('should retrieve user educations', async () => {
    const auth = await tester.signup();
    const educationA = await tester.createEducation({ userId: auth.user.id });
    const educationB = await tester.createEducation({ userId: auth.user.id });
    const educationC = await tester.createEducation({ userId: auth.user.id });

    const result = await listUserEducations.execute(auth.user.id);
    expect(result).toHaveLength(3);

    const resultA = result.find((e) => e.id === educationA.id);
    const resultB = result.find((e) => e.id === educationB.id);
    const resultC = result.find((e) => e.id === educationC.id);

    expect(resultA).toEqual(educationA);
    expect(resultB).toEqual(educationB);
    expect(resultC).toEqual(educationC);
  });

  it('should not return educations from other users', async () => {
    const authA = await tester.signup();
    const authB = await tester.signup();

    await tester.createEducation({ userId: authA.user.id });
    await tester.createEducation({ userId: authB.user.id });
    await tester.createEducation({ userId: authA.user.id });
    await tester.createEducation({ userId: authB.user.id });
    await tester.createEducation({ userId: authA.user.id });

    const resultA = await listUserEducations.execute(authA.user.id);
    const resultB = await listUserEducations.execute(authB.user.id);

    expect(resultA).toHaveLength(3);
    expect(resultB).toHaveLength(2);
  });

  it('should return empty array if user has no education', async () => {
    const result = await listUserEducations.execute(faker.string.uuid());
    expect(result).toHaveLength(0);
  });
});
