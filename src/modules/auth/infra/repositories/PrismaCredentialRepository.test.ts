import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import { createCredential, createUser } from 'src/infra/tests/test-helpers';
import { Id } from 'src/modules/common/application/value-objects/Id';

describe('PrismaCredentialRepository', () => {
  const { userRepository, credentialRepository, transactionService, prisma } =
    createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  describe('findByUserId', () => {
    it('should return null if credential does not exist', async () => {
      const credentialFound = await credentialRepository.findByUserId(
        new Id(faker.string.uuid()),
      );
      expect(credentialFound).toBeNull();
    });
    it('should return credential if credential exists', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      const credentialFound = await credentialRepository.findByUserId(
        credential.userId,
      );
      expect(credentialFound).toEqual(credential);
    });
    it('should use transaction', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      const credentialFound = await transactionService.transaction(
        async (transaction) => {
          return await credentialRepository.findByUserId(credential.userId, {
            transaction,
          });
        },
      );

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(credentialFound).toEqual(credential);
    });
  });
  describe('add', () => {
    it('should add credential', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      const credentialFound = await credentialRepository.findByUserId(
        credential.userId,
      );
      expect(credentialFound).toEqual(credential);
    });
    it('should throw error if credential already exists', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      await expect(credentialRepository.add(credential)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, credential } = createUserAndCredential();

      await transactionService.transaction(async (transaction) => {
        await userRepository.add(user, { transaction });
        await credentialRepository.add(credential, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const credentialFound = await credentialRepository.findByUserId(
        credential.userId,
      );
      expect(credentialFound).toEqual(credential);
    });
  });
  describe('update', () => {
    it('should update credential', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      credential.password = faker.internet.password();
      await credentialRepository.update(credential);

      const credentialFound = await credentialRepository.findByUserId(
        credential.userId,
      );
      expect(credentialFound).toEqual(credential);
    });
    it('should throw error if credential does not exist', async () => {
      const { credential } = createUserAndCredential();

      await expect(credentialRepository.update(credential)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, credential } = createUserAndCredential();
      await userRepository.add(user);
      await credentialRepository.add(credential);

      credential.password = faker.internet.password();

      await transactionService.transaction(async (transaction) => {
        await credentialRepository.update(credential, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const credentialFound = await credentialRepository.findByUserId(
        credential.userId,
      );
      expect(credentialFound).toEqual(credential);
    });
  });
});

function createUserAndCredential() {
  const user = createUser();
  const credential = createCredential(user);
  return { user, credential };
}
