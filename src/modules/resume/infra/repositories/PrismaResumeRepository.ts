import { Injectable } from '@nestjs/common';
import { Resume as ResumeData } from '@prisma/client';
import {
  TransactionOptions,
  TransactionService,
} from 'src/modules/common/application/repositories/TransactionService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { Resume } from '../../application/entities/Resume.entity';
import { ResumeRepository } from '../../application/repositories/ResumeRepository';

type ResumeDataAndRelations = ResumeData & {
  experienceToResumes: {
    experienceId: string;
  }[];
  educationToResumes: {
    educationId: string;
  }[];
};

@Injectable()
export class PrismaResumeRepository extends ResumeRepository {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {
    super();
  }

  async add(
    resume: Resume,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).resume.create({
      data: {
        id: resume.id.value,
        userId: resume.userId.value,
        name: resume.name.value,
        title: resume.title.value,
        description: resume.description,
        experienceToResumes: {
          createMany: {
            data: resume.experiences.map((e) => ({ experienceId: e.value })),
          },
        },
        educationToResumes: {
          createMany: {
            data: resume.educations.map((e) => ({ educationId: e.value })),
          },
        },
      },
    });
  }

  async update(
    resume: Resume,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.transactionService.transaction(
      async (transaction) => {
        await this.prisma
          .useTransaction(transaction)
          .experienceToResume.deleteMany({
            where: { resumeId: resume.id.value },
          });
        await this.prisma
          .useTransaction(transaction)
          .educationToResume.deleteMany({
            where: { resumeId: resume.id.value },
          });

        await this.prisma.useTransaction(transaction).resume.update({
          where: { id: resume.id.value },
          data: {
            name: resume.name.value,
            title: resume.title.value,
            description: resume.description,
            experienceToResumes: {
              createMany: {
                data: resume.experiences.map((e) => ({
                  experienceId: e.value,
                })),
              },
            },
            educationToResumes: {
              createMany: {
                data: resume.educations.map((e) => ({ educationId: e.value })),
              },
            },
          },
        });
      },
      options?.transaction,
    );
  }

  async delete(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma
      .useTransaction(options?.transaction)
      .resume.delete({ where: { id: id.value } });
  }

  async findById(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Resume | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .resume.findUnique({
        where: { id: id.value },
        include: {
          experienceToResumes: {
            select: { experienceId: true },
          },
          educationToResumes: {
            select: { educationId: true },
          },
        },
      });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async listByUserId(
    userId: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Resume[]> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .resume.findMany({
        where: { userId: userId.value },
        include: {
          experienceToResumes: {
            select: { experienceId: true },
          },
          educationToResumes: {
            select: { educationId: true },
          },
        },
      });
    return data.map((e) => this.convertToEntity(e));
  }

  private convertToEntity(data: ResumeDataAndRelations): Resume {
    return Resume.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      name: new Name(data.name),
      title: new Name(data.title),
      description: data.description,
      experiences: data.experienceToResumes.map((e) => new Id(e.experienceId)),
      educations: data.educationToResumes.map((e) => new Id(e.educationId)),
      updatedAt: data.updatedAt,
    });
  }
}
