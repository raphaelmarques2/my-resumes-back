import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { GetUserProfileUseCase } from './get-user-profile.usecase';

describe('getUserProfile', () => {
  let tester: MemoryUseCaseTester;
  let getUserProfile: GetUserProfileUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    getUserProfile = new GetUserProfileUseCase(tester.profileRepository);
  });

  it('should return user profile', async () => {
    const auth = await tester.signup();
    const profile = await getUserProfile.execute(auth.user.id);
    expect(profile).toEqual(
      expect.objectContaining({
        id: expect.toBeUUID(),
        userId: auth.user.id,
      }),
    );
  });
  it('should throw error if user does not exist', async () => {
    await expect(getUserProfile.execute(faker.string.uuid())).rejects.toThrow(
      NotFoundException,
    );
  });
});
