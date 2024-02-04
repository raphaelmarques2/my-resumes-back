import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest as Data } from '@prisma/client';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { ResetPasswordRequest } from '../../application/entities/ResetPassordRequest.entity';
import { ResetPasswordRequestRepository } from '../../application/repositories/ResetPasswordRequestRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';

@Injectable()
export class PrismaResetPasswordRequestRepository extends ResetPasswordRequestRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findByToken(
    token: Id,
    options?: TransactionOptions,
  ): Promise<ResetPasswordRequest | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .resetPasswordRequest.findUnique({
        where: { token: token.value },
      });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async add(
    request: ResetPasswordRequest,
    options?: TransactionOptions,
  ): Promise<void> {
    await this.prisma
      .useTransaction(options?.transaction)
      .resetPasswordRequest.create({
        data: {
          id: request.id.value,
          userId: request.userId.value,
          expiresAt: request.expiresAt,
          token: request.token.value,
          active: request.active,
        },
      });
  }

  async update(
    request: ResetPasswordRequest,
    options?: TransactionOptions,
  ): Promise<void> {
    await this.prisma
      .useTransaction(options?.transaction)
      .resetPasswordRequest.update({
        where: { id: request.id.value },
        data: {
          active: request.active,
        },
      });
  }

  private convertToEntity(data: Data): ResetPasswordRequest {
    return ResetPasswordRequest.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      expiresAt: data.expiresAt,
      token: new Id(data.token),
      active: data.active,
    });
  }
}
