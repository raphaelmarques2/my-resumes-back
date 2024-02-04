import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import { createProfile } from 'src/infra/tests/test-helpers';
import { User } from 'src/modules/auth/application/entities/User.entity';
import { Email } from 'src/modules/common/application/value-objects/Email';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('PrismaProfileRepository', () => {
  const { userRepository, profileRepository, transactionService, prisma } =
    createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  describe('add', () => {
    it('should add profile', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      const profileFound = await profileRepository.findByUserId(user.id);
      expect(profileFound).toEqual(profile);
    });
    it('should throw error if profile already exists', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      await expect(profileRepository.add(profile)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);

      await transactionService.transaction(async (transaction) => {
        await profileRepository.add(profile, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const profileFound = await profileRepository.findByUserId(user.id);
      expect(profileFound).toEqual(profile);
    });
  });
  describe('findByUserId', () => {
    it('should return null if profile does not exist', async () => {
      const profileFound = await profileRepository.findByUserId(
        new Id(faker.string.uuid()),
      );
      expect(profileFound).toBeNull();
    });
    it('should return profile if profile exists', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      const profileFound = await profileRepository.findByUserId(user.id);
      expect(profileFound).toEqual(profile);
    });
    it('should use transaction', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      const profileFound = await transactionService.transaction(
        async (transaction) => {
          return await profileRepository.findByUserId(user.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(profileFound).toEqual(profile);
    });
  });
  describe('findById', () => {
    it('should return null if profile does not exist', async () => {
      const profileFound = await profileRepository.findById(
        new Id(faker.string.uuid()),
      );
      expect(profileFound).toBeNull();
    });
    it('should return profile if profile exists', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      const profileFound = await profileRepository.findById(profile.id);
      expect(profileFound).toEqual(profile);
    });
    it('should use transaction', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      const profileFound = await transactionService.transaction(
        async (transaction) => {
          return await profileRepository.findById(profile.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(profileFound).toEqual(profile);
    });
  });
  describe('update', () => {
    it('should update profile with all fields', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      profile.update({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.lorem.sentence(),
        linkedin: faker.internet.url(),
      });

      await profileRepository.update(profile);

      const profileFound = await profileRepository.findById(profile.id);
      expect(profileFound).toEqual(profile);
    });
    it('should update profile with empty fields', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      profile.update({
        name: '',
        email: '',
        address: '',
        linkedin: '',
      });

      await profileRepository.update(profile);

      const profileFound = await profileRepository.findById(profile.id);
      expect(profileFound).toEqual(profile);
    });
    it('should throw error if profile does not exist', async () => {
      const { profile } = createUserAndProfile();

      await expect(profileRepository.update(profile)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, profile } = createUserAndProfile();
      await userRepository.add(user);
      await profileRepository.add(profile);

      profile.update({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.lorem.sentence(),
        linkedin: faker.internet.url(),
      });

      await transactionService.transaction(async (transaction) => {
        await profileRepository.update(profile, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const profileFound = await profileRepository.findById(profile.id);
      expect(profileFound).toEqual(profile);
    });
  });
});

function createUser() {
  return User.load({
    id: new Id(faker.string.uuid()),
    name: new Name(faker.person.fullName()),
    email: new Email(faker.internet.email()),
  });
}

function createUserAndProfile() {
  const user = createUser();
  const profile = createProfile(user);
  return { user, profile };
}
