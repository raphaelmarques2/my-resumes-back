import { Injectable } from '@nestjs/common';
import { CredentialRepository } from '../../application/repositories/CredentialRepository';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Credential } from '../../application/entities/Credential.entity';
import { UserCredential as CredentialData } from '@prisma/client';

@Injectable()
export class PrismaCredentialRepository extends CredentialRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findByUserId(
    userId: Id,
    options?: TransactionOptions,
  ): Promise<Credential | null> {
    const credential = await this.prisma
      .useTransaction(options?.transaction)
      .userCredential.findUnique({
        where: { userId: userId.value },
      });
    if (!credential) return null;
    return this.convertToEntity(credential);
  }

  async add(
    credential: Credential,
    options?: TransactionOptions,
  ): Promise<void> {
    await this.prisma
      .useTransaction(options?.transaction)
      .userCredential.create({
        data: {
          id: credential.id.value,
          userId: credential.userId.value,
          password: credential.password,
        },
      });
  }

  async update(
    credential: Credential,
    options?: TransactionOptions,
  ): Promise<void> {
    await this.prisma
      .useTransaction(options?.transaction)
      .userCredential.update({
        where: { id: credential.id.value },
        data: {
          password: credential.password,
        },
      });
  }

  private convertToEntity(data: CredentialData): Credential {
    return Credential.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      password: data.password,
    });
  }
}
