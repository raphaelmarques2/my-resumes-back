import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { cleanDatabase } from './db-fixtures';
import { PrismaCredentialRepository } from 'src/modules/auth/infra/repositories/PrismaCredentialRepository';
import { PrismaResetPasswordRequestRepository } from 'src/modules/auth/infra/repositories/PrismaResetPasswordRequestRepository';
import { PrismaUserRepository } from 'src/modules/auth/infra/repositories/PrismaUserRepository';
import { PrismaTransactionService } from 'src/modules/common/infra/repositories/PrismaTransactionService';
import { PrismaEducationRepository } from 'src/modules/education/infra/repositories/PrismaEducationRepository';
import { PrismaExperienceRepository } from 'src/modules/experience/infra/repositories/PrismaExperienceRepository';
import { PrismaProfileRepository } from 'src/modules/profile/infra/repositories/PrismaProfileRepository';
import { PrismaResumeRepository } from 'src/modules/resume/infra/repositories/PrismaResumeRepository';

export function createRepositoryTester() {
  const prisma: PrismaService = new PrismaService();

  const transactionService = new PrismaTransactionService(prisma);

  const userRepository = new PrismaUserRepository(prisma);
  const profileRepository = new PrismaProfileRepository(prisma);
  const credentialRepository = new PrismaCredentialRepository(prisma);
  const educationRepository = new PrismaEducationRepository(prisma);
  const experienceRepository = new PrismaExperienceRepository(prisma);
  const resumeRepository = new PrismaResumeRepository(
    prisma,
    transactionService,
  );
  const resetPasswordRequestRepository =
    new PrismaResetPasswordRequestRepository(prisma);

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await prisma.$disconnect();
  });

  return {
    prisma,
    userRepository,
    profileRepository,
    credentialRepository,
    educationRepository,
    experienceRepository,
    resumeRepository,
    resetPasswordRequestRepository,
    transactionService,
  };
}
