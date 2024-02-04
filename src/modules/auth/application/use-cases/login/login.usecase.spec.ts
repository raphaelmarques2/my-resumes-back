import { UnauthorizedException } from '@nestjs/common';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { SignupDto } from '../signup/signup.dto';
import { LoginDto } from './login.dto';
import { LoginUseCase } from './login.usecase';

describe('login', () => {
  let tester: MemoryUseCaseTester;
  let login: LoginUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    login = new LoginUseCase(
      tester.userRepository,
      tester.credentialRepository,
      tester.passwordService,
      tester.authTokenService,
    );
  });

  it('should validate user login and return a token', async () => {
    const signupDto: SignupDto = {
      name: 'User',
      email: 'test@test.com',
      password: '123456789',
    };
    await tester.signup(signupDto);

    const loginDto: LoginDto = {
      email: signupDto.email,
      password: signupDto.password,
    };
    const result = await login.execute(loginDto);

    expect(result).toEqual({
      token: expect.any(String),
      user: {
        id: expect.toBeUUID(),
        name: 'User',
        email: 'test@test.com',
      },
    });
  });

  it('should throw an error if email does not exist', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: '123456789',
    };

    await expect(login.execute(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if password is incorrect', async () => {
    const signupDto: SignupDto = {
      name: 'User',
      email: 'test@example.com',
      password: '123456789',
    };

    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    await tester.signup(signupDto);

    await expect(login.execute(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
