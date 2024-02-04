import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { faker } from '@faker-js/faker';
import { ResetPasswordRequest } from '../../entities/ResetPassordRequest.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { BadRequestException } from '@nestjs/common';
import { UpdatePasswordByResetTokenUseCase } from './update-password-by-reset-token.usecase';

describe('validatePasswordResetToken', () => {
  let tester: MemoryUseCaseTester;
  let updatePasswordByResetToken: UpdatePasswordByResetTokenUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    updatePasswordByResetToken = new UpdatePasswordByResetTokenUseCase(
      tester.transactionService,
      tester.credentialRepository,
      tester.passwordService,
      tester.resetPasswordRequestRepository,
    );
  });

  it('should update password if token is valid', async () => {
    const auth = await tester.signup();

    const request = ResetPasswordRequest.create({
      userId: new Id(auth.user.id),
    });
    await tester.resetPasswordRequestRepository.add(request);

    await updatePasswordByResetToken.execute({
      token: request.token.value,
      password: 'new-password',
    });

    await expect(
      tester.login({
        email: auth.user.email,
        password: 'new-password',
      }),
    ).resolves.not.toThrow();

    expect(
      tester.resetPasswordRequestRepository.items.items[0].active,
    ).toBeFalsy();
  });
  it('should throw error if request is not found', async () => {
    await expect(
      updatePasswordByResetToken.execute({
        token: faker.string.uuid(),
        password: 'new-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
  it('should throw error if request is invalid', async () => {
    const auth = await tester.signup();

    const request = ResetPasswordRequest.create({
      userId: new Id(auth.user.id),
    });
    request.active = false;
    await tester.resetPasswordRequestRepository.add(request);

    await expect(
      updatePasswordByResetToken.execute({
        token: request.token.value,
        password: 'new-password',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
