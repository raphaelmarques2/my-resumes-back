import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { UpdatePasswordUseCase } from './update-password.usecase';
import { BadRequestException } from '@nestjs/common';

describe('updatePassword', () => {
  let tester: MemoryUseCaseTester;
  let updatePassword: UpdatePasswordUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    updatePassword = new UpdatePasswordUseCase(
      tester.userRepository,
      tester.credentialRepository,
      tester.passwordService,
    );
  });

  it('should update user password', async () => {
    const currentPassword = 'a-password';
    const newPassword = 'a-new-password';

    const auth = await tester.signup({ password: currentPassword });
    await updatePassword.execute(auth.user.id, {
      currentPassword,
      newPassword,
    });
    const result = await tester.login({
      email: auth.user.email,
      password: newPassword,
    });
    expect(result.token).toBeDefined();
  });
  it('should throw with a invalid current password', async () => {
    const currentPassword = 'a-password';
    const newPassword = 'a-new-password';

    const auth = await tester.signup({ password: currentPassword });
    await expect(
      updatePassword.execute(auth.user.id, {
        currentPassword: 'invalid-current-password',
        newPassword,
      }),
    ).rejects.toThrow(BadRequestException);
  });
  it('should throw with a invalid new password', async () => {
    const currentPassword = 'a-password';
    const newPassword = '0';

    const auth = await tester.signup({ password: currentPassword });
    await expect(
      updatePassword.execute(auth.user.id, {
        currentPassword,
        newPassword,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
