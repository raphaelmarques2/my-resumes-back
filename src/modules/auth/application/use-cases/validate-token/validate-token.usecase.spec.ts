import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenService } from 'src/modules/auth/application/services/AuthTokenService';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { ValidateTokenUseCase } from './validate-token.usecase';

describe('validate-token', () => {
  let tester: MemoryUseCaseTester;
  let validateToken: ValidateTokenUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    validateToken = new ValidateTokenUseCase(
      tester.userRepository,
      new AuthTokenService(new JwtService({ secret: 'test' })),
    );
  });

  it('should authenticate token', async () => {
    const auth = await tester.signup();
    const result = await validateToken.execute(auth.token);
    expect(result).toEqual({
      token: expect.any(String),
      user: auth.user,
    });
  });

  it('should throw with a invalid token', async () => {
    await expect(validateToken.execute('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
