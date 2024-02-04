import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import { createUser, createRequest } from 'src/infra/tests/test-helpers';
import { Id } from 'src/modules/common/application/value-objects/Id';

describe('PrismaResetPasswordRequestRepository', () => {
  const {
    userRepository,
    resetPasswordRequestRepository,
    transactionService,
    prisma,
  } = createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  describe('findByToken', () => {
    it('should return null if request does not exist', async () => {
      const requestFound = await resetPasswordRequestRepository.findByToken(
        new Id(faker.string.uuid()),
      );
      expect(requestFound).toBeNull();
    });
    it('should return request if request exists', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      const requestFound = await resetPasswordRequestRepository.findByToken(
        request.token,
      );
      expect(requestFound).toEqual(request);
    });
    it('should use transaction', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      const requestFound = await transactionService.transaction(
        async (transaction) => {
          return await resetPasswordRequestRepository.findByToken(
            request.token,
            { transaction },
          );
        },
      );

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(requestFound).toEqual(request);
    });
  });
  describe('add', () => {
    it('should add request', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      const requestFound = await resetPasswordRequestRepository.findByToken(
        request.token,
      );
      expect(requestFound).toEqual(request);
    });
    it('should throw error if request already exists', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      await expect(
        resetPasswordRequestRepository.add(request),
      ).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);

      await transactionService.transaction(async (transaction) => {
        await resetPasswordRequestRepository.add(request, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const requestFound = await resetPasswordRequestRepository.findByToken(
        request.token,
      );
      expect(requestFound).toEqual(request);
    });
  });
  describe('update', () => {
    it('should update request', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      request.active = false;
      await resetPasswordRequestRepository.update(request);

      const requestFound = await resetPasswordRequestRepository.findByToken(
        request.token,
      );
      expect(requestFound).toEqual(request);
    });
    it('should use transaction', async () => {
      const { user, request } = createUserAndRequest();
      await userRepository.add(user);
      await resetPasswordRequestRepository.add(request);

      request.active = false;
      await transactionService.transaction(async (transaction) => {
        await resetPasswordRequestRepository.update(request, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const requestFound = await resetPasswordRequestRepository.findByToken(
        request.token,
      );
      expect(requestFound).toEqual(request);
    });
  });
});

function createUserAndRequest() {
  const user = createUser();
  const request = createRequest(user);
  return { user, request };
}
