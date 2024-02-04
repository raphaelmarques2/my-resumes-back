import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import { createUser, createExperience } from 'src/infra/tests/test-helpers';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('PrismaExperienceRepository', () => {
  const { userRepository, experienceRepository, transactionService, prisma } =
    createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  describe('add', () => {
    it('should add an experience', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
    it('should throw error if experience already exists', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      await expect(experienceRepository.add(experience)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);

      await transactionService.transaction(async (transaction) => {
        await experienceRepository.add(experience, { transaction });
      });

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
  });
  describe('update', () => {
    it('should update an experience with all dates', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      experience.update({
        title: new Name(faker.lorem.word()),
        company: new Name(faker.lorem.word()),
        description: faker.lorem.paragraph(),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
      });
      await experienceRepository.update(experience);

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
    it('should update an experience wit empty dates', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      experience.update({
        startDate: null,
        endDate: null,
      });
      await experienceRepository.update(experience);

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
    it('should throw error if experience does not exist', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);

      await expect(experienceRepository.update(experience)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      experience.update({
        title: new Name(faker.lorem.word()),
        company: new Name(faker.lorem.word()),
        description: faker.lorem.paragraph(),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
      });

      await transactionService.transaction(async (transaction) => {
        await experienceRepository.update(experience, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
  });
  describe('delete', () => {
    it('should delete an experience', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      await experienceRepository.delete(experience.id);

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toBeNull();
    });
    it('should throw error if experience does not exist', async () => {
      const { experience } = createUserAndExperience();

      await expect(
        experienceRepository.delete(experience.id),
      ).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      await transactionService.transaction(async (transaction) => {
        await experienceRepository.delete(experience.id, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toBeNull();
    });
  });
  describe('findById', () => {
    it('should return null if experience does not exist', async () => {
      const experienceFound = await experienceRepository.findById(
        new Id(faker.string.uuid()),
      );
      expect(experienceFound).toBeNull();
    });
    it('should return experience if experience exists', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      const experienceFound = await experienceRepository.findById(
        experience.id,
      );
      expect(experienceFound).toEqual(experience);
    });
    it('should use transaction', async () => {
      const { user, experience } = createUserAndExperience();
      await userRepository.add(user);
      await experienceRepository.add(experience);

      const experienceFound = await transactionService.transaction(
        async (transaction) => {
          return await experienceRepository.findById(experience.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      expect(experienceFound).toEqual(experience);
    });
  });
  describe('listByUserId', () => {
    it('should return empty array if user has no experiences', async () => {
      const user = createUser();
      await userRepository.add(user);

      const experiences = await experienceRepository.listByUserId(user.id);
      expect(experiences).toEqual([]);
    });
    it('should return experiences if user has experiences', async () => {
      const user = createUser();
      const experiences = [createExperience(user), createExperience(user)];
      await userRepository.add(user);
      for (const experience of experiences) {
        await experienceRepository.add(experience);
      }

      const experiencesFound = await experienceRepository.listByUserId(user.id);
      expect(experiencesFound).toEqual(experiences);
    });
    it('should use transaction', async () => {
      const user = createUser();
      const experiences = [createExperience(user), createExperience(user)];
      await userRepository.add(user);
      for (const experience of experiences) {
        await experienceRepository.add(experience);
      }

      const experiencesFound = await transactionService.transaction(
        async (transaction) => {
          return await experienceRepository.listByUserId(user.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      expect(experiencesFound).toEqual(experiences);
    });
  });
});

function createUserAndExperience() {
  const user = createUser();
  const experience = createExperience(user);
  return { user, experience };
}
