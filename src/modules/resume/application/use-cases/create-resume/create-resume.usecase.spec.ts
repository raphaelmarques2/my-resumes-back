import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { CreateResumeDto } from './CreateResumeDto';
import { CreateResumeUseCase } from './create-resume.usecase';

describe('createResume', () => {
  let tester: MemoryUseCaseTester;
  let createResume: CreateResumeUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    createResume = new CreateResumeUseCase(
      tester.userRepository,
      tester.resumeRepository,
    );
  });
  it('should create resume', async () => {
    const auth = await tester.signup();
    const input: CreateResumeDto = {
      userId: auth.user.id,
    };
    const resume = await createResume.execute(input);
    expect(resume).toEqual({
      id: expect.toBeUUID(),
      userId: auth.user.id,
      title: 'Title',
      name: 'Name',
      updatedAt: expect.toBeIsoDate(),
      description: '',
      experiences: [],
      educations: [],
    });
  });
});
