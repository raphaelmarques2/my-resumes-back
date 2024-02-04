import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { UpdateProfileDto } from './UpdateProfileDto';
import { UpdateProfileUseCase } from './update-profile.usecase';

describe('updateProfile', () => {
  let tester: MemoryUseCaseTester;
  let updateProfile: UpdateProfileUseCase;

  beforeAll(async () => {
    tester = new MemoryUseCaseTester();
    updateProfile = new UpdateProfileUseCase(
      tester.transactionService,
      tester.profileRepository,
    );
  });
  it('should update profile', async () => {
    const auth = await tester.signup();

    const profile = await tester.profileRepository.findByUserId(
      new Id(auth.user.id),
    );
    if (!profile) throw new Error();

    const input: UpdateProfileDto = {
      name: faker.internet.userName(),
      address: faker.lorem.sentence(),
      email: faker.internet.email(),
      linkedin: faker.internet.url(),
    };

    const updatedProfile = await updateProfile.execute(profile.id.value, input);
    expect(updatedProfile).toEqual({
      id: profile.id.value,
      userId: profile.userId.value,
      name: input.name,
      address: input.address,
      email: input.email,
      linkedin: input.linkedin,
    });
  });
  it('should throw error if profile does not exist', async () => {
    await expect(
      updateProfile.execute(faker.string.uuid(), {}),
    ).rejects.toThrow(NotFoundException);
  });
});
