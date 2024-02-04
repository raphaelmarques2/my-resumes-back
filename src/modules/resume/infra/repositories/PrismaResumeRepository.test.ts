import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createRepositoryTester } from 'src/infra/tests/repository-tester';
import {
  createEducation,
  createExperience,
  createResume,
  createUser,
} from 'src/infra/tests/test-helpers';
import { User } from 'src/modules/auth/application/entities/User.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Resume } from '../../application/entities/Resume.entity';
import { Education } from 'src/modules/education/application/entities/Education.entity';
import { Experience } from 'src/modules/experience/application/entities/Experience.entity';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('PrismaResumeRepository', () => {
  const {
    userRepository,
    resumeRepository,
    educationRepository,
    experienceRepository,
    transactionService,
    prisma,
  } = createRepositoryTester();

  const useTransactionSpy = jest.spyOn(prisma, 'useTransaction');

  async function addAll({
    user,
    resume,
    educations,
    experiences,
  }: {
    user: User;
    resume: Resume;
    educations: Education[];
    experiences: Experience[];
  }) {
    await userRepository.add(user);
    for (const education of educations) {
      await educationRepository.add(education);
    }
    for (const experience of experiences) {
      await experienceRepository.add(experience);
    }
    await resumeRepository.add(resume);
  }

  describe('add', () => {
    it('should add resume without educations and experiences', async () => {
      const { user, resume } = createResumeData();
      await userRepository.add(user);
      await resumeRepository.add(resume);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should add resume with educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);

      await addAll({ user, resume, educations, experiences });

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should throw error if resume already exists', async () => {
      const { user, resume } = createResumeData();
      await userRepository.add(user);
      await resumeRepository.add(resume);

      await expect(resumeRepository.add(resume)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, resume } = createResumeData();
      await userRepository.add(user);

      await transactionService.transaction(async (transaction) => {
        await resumeRepository.add(resume, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
  });
  describe('findById', () => {
    it('should return null if resume does not exist', async () => {
      const resumeFound = await resumeRepository.findById(
        new Id(faker.string.uuid()),
      );
      expect(resumeFound).toBeNull();
    });
    it('should return resume without educations and experiences', async () => {
      const { user, resume } = createResumeData();
      await userRepository.add(user);
      await resumeRepository.add(resume);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should return resume with educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);

      await addAll({ user, resume, educations, experiences });

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should use transaction', async () => {
      const { user, resume } = createResumeData();
      await userRepository.add(user);
      await resumeRepository.add(resume);

      const resumeFound = await transactionService.transaction(
        async (transaction) => {
          return await resumeRepository.findById(resume.id, { transaction });
        },
      );

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
  });
  describe('update', () => {
    it('should update resume removing educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);

      await addAll({ user, resume, educations, experiences });

      resume.update({
        name: new Name(faker.lorem.sentence()),
        title: new Name(faker.lorem.sentence()),
        description: faker.lorem.paragraph(),
        educations: [],
        experiences: [],
      });
      await resumeRepository.update(resume);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should update resume adding educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();
      await addAll({ user, resume, educations, experiences });

      resume.update({
        educations: educations.map((e) => e.id),
        experiences: experiences.map((e) => e.id),
      });
      await resumeRepository.update(resume);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
    it('should throw error if resume does not exist', async () => {
      const { resume } = createResumeData();

      await expect(resumeRepository.update(resume)).rejects.toThrow();
    });
    it('should always use transaction', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);
      await addAll({ user, resume, educations, experiences });

      resume.update({
        name: new Name(faker.lorem.sentence()),
      });

      await resumeRepository.update(resume);

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toEqual({
        ...resume,
        updatedAt: expect.any(Date),
      });
    });
  });
  describe('delete', () => {
    it('should delete resume without educations and experiences', async () => {
      const { user, resume } = createResumeData();
      await addAll({ user, resume, educations: [], experiences: [] });

      await resumeRepository.delete(resume.id);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toBeNull();
    });
    it('should delete resume with educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);

      await addAll({ user, resume, educations, experiences });

      await resumeRepository.delete(resume.id);

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toBeNull();
    });
    it('should throw error if resume does not exist', async () => {
      const { resume } = createResumeData();

      await expect(resumeRepository.delete(resume.id)).rejects.toThrow();
    });
    it('should use transaction', async () => {
      const { user, resume } = createResumeData();
      await addAll({ user, resume, educations: [], experiences: [] });

      await transactionService.transaction(async (transaction) => {
        await resumeRepository.delete(resume.id, { transaction });
      });
      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));

      const resumeFound = await resumeRepository.findById(resume.id);
      expect(resumeFound).toBeNull();
    });
  });
  describe('listUserResumes', () => {
    it('should return empty array if user does not have resumes', async () => {
      const { user } = createResumeData();
      await userRepository.add(user);

      const resumesFound = await resumeRepository.listByUserId(user.id);
      expect(resumesFound).toEqual([]);
    });
    it('should return resumes without educations and experiences', async () => {
      const { user, resume } = createResumeData();
      await addAll({ user, resume, educations: [], experiences: [] });

      const resumesFound = await resumeRepository.listByUserId(user.id);
      expect(resumesFound).toEqual([
        {
          ...resume,
          updatedAt: expect.any(Date),
        },
      ]);
    });
    it('should return resumes with educations and experiences', async () => {
      const { user, resume, educations, experiences } = createResumeData();

      resume.educations = educations.map((e) => e.id);
      resume.experiences = experiences.map((e) => e.id);

      await addAll({ user, resume, educations, experiences });

      const resumesFound = await resumeRepository.listByUserId(user.id);
      expect(resumesFound).toEqual([
        {
          ...resume,
          updatedAt: expect.any(Date),
        },
      ]);
    });
    it('should use transaction', async () => {
      const { user, resume } = createResumeData();
      await addAll({ user, resume, educations: [], experiences: [] });

      const resumesFound = await transactionService.transaction(
        async (transaction) => {
          return await resumeRepository.listByUserId(user.id, {
            transaction,
          });
        },
      );

      expect(useTransactionSpy).toHaveBeenCalledWith(expect.any(PrismaClient));
      expect(resumesFound).toEqual([
        {
          ...resume,
          updatedAt: expect.any(Date),
        },
      ]);
    });
  });
});

function createResumeData() {
  const user = createUser();
  const resume = createResume(user);

  const educations = [
    createEducation(user),
    createEducation(user),
    createEducation(user),
  ];

  const experiences = [
    createExperience(user),
    createExperience(user),
    createExperience(user),
  ];

  return { user, resume, educations, experiences };
}
