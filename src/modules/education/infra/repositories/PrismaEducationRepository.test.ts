import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import { createEducation, createUser } from 'src/infra/tests/test-helpers';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('PrismaEducationRepository', () => {
  const { userRepository, educationRepository, transactionService, prisma } =
    createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  describe('findById', () => {
    it('should return null if education does not exist', async () => {
      const educationFound = await educationRepository.findById(
        new Id(faker.string.uuid()),
      );
      expect(educationFound).toBeNull();
    });
    it('should return education if education exists', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
    it('should use transaction', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      const educationFound = await transactionService.transaction(
        async (transaction) => {
          return await educationRepository.findById(education.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      expect(educationFound).toEqual(education);
    });
  });
  describe('add', () => {
    it('should add education', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
    it('should throw error if education already exists', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      await expect(educationRepository.add(education)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);

      await transactionService.transaction(async (transaction) => {
        await educationRepository.add(education, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
  });
  describe('update', () => {
    it('should update education with all dates', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      education.update({
        title: new Name(faker.lorem.word()),
        institution: new Name(faker.company.name()),
        startDate: faker.date.past(),
        endDate: faker.date.past(),
      });
      await educationRepository.update(education);

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
    it('should update education with empty dates', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      education.update({
        startDate: null,
        endDate: null,
      });
      await educationRepository.update(education);

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
    it('should throw error if education does not exist', async () => {
      const { education } = createUserAndEducation();

      await expect(educationRepository.update(education)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      education.update({
        title: new Name(faker.lorem.word()),
        institution: new Name(faker.company.name()),
      });

      await transactionService.transaction(async (transaction) => {
        await educationRepository.update(education, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toEqual(education);
    });
  });
  describe('listByUserId', () => {
    it('should return empty array if user does not have education', async () => {
      const user = createUser();
      await userRepository.add(user);

      const educationFound = await educationRepository.listByUserId(user.id);
      expect(educationFound).toEqual([]);
    });
    it('should return array of education if user has education', async () => {
      const user = createUser();
      const educations = [createEducation(user), createEducation(user)];

      await userRepository.add(user);
      for (const education of educations) {
        await educationRepository.add(education);
      }

      const educationsFound = await educationRepository.listByUserId(user.id);
      expect(educationsFound).toEqual(educations);
    });
    it('should use transaction', async () => {
      const user = createUser();
      const educations = [createEducation(user), createEducation(user)];

      await userRepository.add(user);
      for (const education of educations) {
        await educationRepository.add(education);
      }

      const educationsFound = await transactionService.transaction(
        async (transaction) => {
          return await educationRepository.listByUserId(user.id, {
            transaction,
          });
        },
      );
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(educationsFound).toEqual(educations);
    });
  });
  describe('delete', () => {
    it('should delete education', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      await educationRepository.delete(education.id);

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toBeNull();
    });
    it('should throw error if education does not exist', async () => {
      const { education } = createUserAndEducation();

      await expect(educationRepository.delete(education.id)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, education } = createUserAndEducation();
      await userRepository.add(user);
      await educationRepository.add(education);

      await transactionService.transaction(async (transaction) => {
        await educationRepository.delete(education.id, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const educationFound = await educationRepository.findById(education.id);
      expect(educationFound).toBeNull();
    });
  });
});

function createUserAndEducation() {
  const user = createUser();
  const education = createEducation(user);
  return { user, education };
}
