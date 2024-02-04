import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Education } from '../../application/entities/Education.entity';
import { EducationRepository } from '../../application/repositories/EducationRepository';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Injectable } from '@nestjs/common';
import { Education as EducationData } from '@prisma/client';
import { Name } from 'src/modules/common/application/value-objects/Name';

@Injectable()
export class PrismaEducationRepository extends EducationRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findById(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Education | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .education.findUnique({ where: { id: id.value } });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async add(
    education: Education,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).education.create({
      data: {
        id: education.id.value,
        userId: education.userId.value,
        title: education.title.value,
        institution: education.institution.value,
        startDate: education.startDate,
        endDate: education.endDate,
      },
    });
  }

  async update(
    education: Education,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).education.update({
      where: { id: education.id.value },
      data: {
        title: education.title.value,
        institution: education.institution.value,
        startDate: education.startDate,
        endDate: education.endDate,
      },
    });
  }

  async listByUserId(
    userId: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Education[]> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .education.findMany({
        where: { userId: userId.value },
      });
    return data.map((e) => this.convertToEntity(e));
  }

  async delete(id: Id, options?: TransactionOptions): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).education.delete({
      where: { id: id.value },
    });
  }

  private convertToEntity(data: EducationData): Education {
    return Education.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      title: new Name(data.title),
      institution: new Name(data.institution),
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }
}
