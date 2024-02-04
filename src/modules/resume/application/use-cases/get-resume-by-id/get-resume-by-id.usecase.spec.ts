import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { GetResumeByIdUseCase } from './get-resume-by-id.usecase';

describe('getResumeById', () => {
  let tester: MemoryUseCaseTester;
  let getResumeById: GetResumeByIdUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    getResumeById = new GetResumeByIdUseCase(tester.resumeRepository);
  });

  it('should return a resume', async () => {
    const auth = await tester.signup();
    const { id } = await tester.createResume({ userId: auth.user.id });
    const resume = await getResumeById.execute(id);
    expect(resume).toEqual(
      expect.objectContaining({
        id,
        userId: auth.user.id,
      }),
    );
  });
  it('should throw error if the resume does not exist', async () => {
    await expect(getResumeById.execute(faker.string.uuid())).rejects.toThrow(
      NotFoundException,
    );
  });
});
