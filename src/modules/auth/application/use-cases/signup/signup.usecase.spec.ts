import { BadRequestException } from '@nestjs/common';
import { MemoryTransactionService } from 'src/modules/common/infra/repositories/MemoryTransactionService';
import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { SignupDto } from './signup.dto';
import { SignupUseCase } from './signup.usecase';

describe('signup', () => {
  let tester: MemoryUseCaseTester;
  let signup: SignupUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();

    signup = new SignupUseCase(
      new MemoryTransactionService(),
      tester.userRepository,
      tester.credentialRepository,
      tester.profileRepository,
      tester.passwordService,
      tester.authTokenService,
    );
  });

  it('should create a new user and return a token', async () => {
    const signupDto: SignupDto = {
      name: 'User',
      email: 'test@test.com',
      password: '123456789',
    };
    const result = await signup.execute(signupDto);
    expect(result).toEqual({
      token: expect.any(String),
      user: {
        id: expect.toBeUUID(),
        name: 'User',
        email: 'test@test.com',
      },
    });
  });
  it('should create a profile when user signs up', async () => {
    const signupDto: SignupDto = {
      name: 'User',
      email: 'test@test.com',
      password: '123456789',
    };
    const user = await signup.execute(signupDto);

    expect(tester.profileRepository.items.items).toHaveLength(1);
    expect(tester.profileRepository.items.items[0]).toEqual(
      expect.objectContaining({
        userId: { value: user.user.id },
        name: signupDto.name,
        email: signupDto.email,
      }),
    );
  });
  it('should throw an error if email is already in use', async () => {
    const signupDto: SignupDto = {
      name: 'User',
      email: 'test@example.com',
      password: '123456789',
    };

    await signup.execute(signupDto);

    await expect(signup.execute(signupDto)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should throw an error for invalid email format', async () => {
    const signupDtoWithInvalidEmail: SignupDto = {
      name: 'User',
      email: 'invalid-email',
      password: '123456789',
    };

    await expect(signup.execute(signupDtoWithInvalidEmail)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should save salted passwords', async () => {
    await signup.execute({
      name: 'A',
      email: 'a@test.com',
      password: '123456789',
    });
    await signup.execute({
      name: 'B',
      email: 'b@test.com',
      password: '123456789',
    });

    expect(tester.credentialRepository.items.items).toHaveLength(2);
    const passwordA = tester.credentialRepository.items.items[0].password;
    const passwordB = tester.credentialRepository.items.items[1].password;
    expect(passwordA).not.toBe(passwordB);
  });
});
