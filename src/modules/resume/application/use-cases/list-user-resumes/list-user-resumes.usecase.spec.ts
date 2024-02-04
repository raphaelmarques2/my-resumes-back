import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { ListUserResumesUseCase } from './list-user-resumes.usecase';

describe('listUserResumes', () => {
  let tester: MemoryUseCaseTester;
  let listUserResumes: ListUserResumesUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    listUserResumes = new ListUserResumesUseCase(tester.resumeRepository);
  });
  it('should return a list of resumes', async () => {
    const auth = await tester.signup();

    const resumeA = await tester.createResume({ userId: auth.user.id });
    const resumeB = await tester.createResume({ userId: auth.user.id });
    const resumeC = await tester.createResume({ userId: auth.user.id });

    const resumes = await listUserResumes.execute(auth.user.id);
    expect(resumes).toEqual([
      expect.objectContaining({ id: resumeA.id, userId: auth.user.id }),
      expect.objectContaining({ id: resumeB.id, userId: auth.user.id }),
      expect.objectContaining({ id: resumeC.id, userId: auth.user.id }),
    ]);
  });
  it('should return an empty list of resumes', async () => {
    const auth = await tester.signup();

    const resumes = await listUserResumes.execute(auth.user.id);
    expect(resumes).toEqual([]);
  });
});
