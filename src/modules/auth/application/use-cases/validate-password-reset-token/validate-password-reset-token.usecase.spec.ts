import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { faker } from '@faker-js/faker';
import { ValidatePasswordResetTokenUseCase } from './validate-password-reset-token.usecase';
import { ResetPasswordRequest } from '../../entities/ResetPassordRequest.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { BadRequestException } from '@nestjs/common';

describe('validatePasswordResetToken', () => {
  let tester: MemoryUseCaseTester;
  let validatePasswordResetToken: ValidatePasswordResetTokenUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    validatePasswordResetToken = new ValidatePasswordResetTokenUseCase(
      tester.userRepository,
      tester.resetPasswordRequestRepository,
    );
  });

  it('should validate reset-password-request', async () => {
    const auth = await tester.signup();

    const request = ResetPasswordRequest.create({
      userId: new Id(auth.user.id),
    });

    await tester.resetPasswordRequestRepository.add(request);

    const userDto = await validatePasswordResetToken.execute(
      request.token.value,
    );

    expect(userDto.id).toBe(auth.user.id);
  });
  it('should throw error if request does not exist', async () => {
    const token = faker.string.uuid();
    await expect(validatePasswordResetToken.execute(token)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should throw error if request is not active', async () => {
    const auth = await tester.signup();

    const request = ResetPasswordRequest.create({
      userId: new Id(auth.user.id),
    });
    request.active = false;

    await tester.resetPasswordRequestRepository.add(request);

    await expect(
      validatePasswordResetToken.execute(request.token.value),
    ).rejects.toThrow(BadRequestException);
  });
});
