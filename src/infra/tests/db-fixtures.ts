import { PrismaService } from 'src/modules/common/infra/services/PrismaService';

export async function cleanDatabase(prisma: PrismaService) {
  const isJest = Boolean(process.env.JEST_WORKER_ID);
  if (!isJest) throw new Error('cleanDatabase should only be used in tests');

  await prisma.educationToResume.deleteMany();
  await prisma.education.deleteMany();

  await prisma.experienceToResume.deleteMany();
  await prisma.experience.deleteMany();

  await prisma.resume.deleteMany();

  await prisma.profile.deleteMany();

  await prisma.resetPasswordRequest.deleteMany();
  await prisma.userCredential.deleteMany();
  await prisma.user.deleteMany();
}
