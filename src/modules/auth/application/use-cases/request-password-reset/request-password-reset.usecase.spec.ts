import { MemoryUseCaseTester } from 'src/modules/common/tests/MemoryUseCaseTester';
import { RequestPasswordResetUseCase } from './request-password-reset.usecase';
import { faker } from '@faker-js/faker';

describe('requestPasswordReset', () => {
  let tester: MemoryUseCaseTester;
  let requestPasswordReset: RequestPasswordResetUseCase;

  beforeEach(() => {
    tester = new MemoryUseCaseTester();
    requestPasswordReset = new RequestPasswordResetUseCase(
      tester.userRepository,
      tester.resetPasswordRequestRepository,
      tester.emailService,
    );
  });

  it('should create reset-password-request and send email', async () => {
    const auth = await tester.signup();
    await requestPasswordReset.execute({ email: auth.user.email });

    expect(tester.resetPasswordRequestRepository.items.items).toHaveLength(1);
    expect(
      tester.resetPasswordRequestRepository.items.items[0].userId.value,
    ).toBe(auth.user.id);

    expect(tester.emailService.emailsSent).toHaveLength(1);
    expect(tester.emailService.emailsSent[0].email.value).toBe(auth.user.email);
  });
  it('should return if user does not exist and do nothing', async () => {
    const email = faker.internet.email();
    await expect(
      requestPasswordReset.execute({ email }),
    ).resolves.not.toThrow();
    expect(tester.resetPasswordRequestRepository.items.items).toHaveLength(0);
    expect(tester.emailService.emailsSent).toHaveLength(0);
  });
});
