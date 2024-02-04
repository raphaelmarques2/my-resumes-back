import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { GetEducationByIdUseCase } from './get-education-by-id.usecase';

describe('getEducationById', () => {
  let tester: MemoryUseCaseTester;
  let getEducationById: GetEducationByIdUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    getEducationById = new GetEducationByIdUseCase(tester.educationRepository);
  });
  it('should retrieve an education', async () => {
    const auth = await tester.signup();
    const { id } = await tester.createEducation({ userId: auth.user.id });
    const result = await getEducationById.execute(id);
    expect(result).toEqual(
      expect.objectContaining({
        id,
        userId: auth.user.id,
      }),
    );
  });

  it('should throw an error if user does not exist', async () => {
    await expect(getEducationById.execute(faker.string.uuid())).rejects.toThrow(
      NotFoundException,
    );
  });
});
