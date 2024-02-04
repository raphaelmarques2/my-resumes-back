import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { ExperienceRepository } from '../../application/repositories/ExperienceRepository';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Experience } from '../../application/entities/Experience.entity';
import { Experience as ExperienceData } from '@prisma/client';
import { Name } from 'src/modules/common/application/value-objects/Name';

@Injectable()
export class PrismaExperienceRepository extends ExperienceRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async add(
    experience: Experience,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).experience.create({
      data: {
        id: experience.id.value,
        userId: experience.userId.value,
        title: experience.title.value,
        company: experience.company.value,
        description: experience.description,
        startDate: experience.startDate,
        endDate: experience.endDate,
      },
    });
  }

  async update(
    experience: Experience,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).experience.update({
      where: { id: experience.id.value },
      data: {
        title: experience.title.value,
        company: experience.company.value,
        description: experience.description,
        startDate: experience.startDate,
        endDate: experience.endDate,
      },
    });
  }

  async delete(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).experience.delete({
      where: { id: id.value },
    });
  }

  async findById(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Experience | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .experience.findUnique({ where: { id: id.value } });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async listByUserId(
    userId: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Experience[]> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .experience.findMany({ where: { userId: userId.value } });
    return data.map((e) => this.convertToEntity(e));
  }

  private convertToEntity(data: ExperienceData): Experience {
    return Experience.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      title: new Name(data.title),
      company: new Name(data.company),
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }
}
