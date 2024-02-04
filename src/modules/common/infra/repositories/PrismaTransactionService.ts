import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import {
  Transaction,
  TransactionService,
} from '../../application/repositories/TransactionService';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaTransactionService extends TransactionService {
  constructor(private prismaService: PrismaService) {
    super();
  }

  async transaction<T>(
    fn: (transaction: Transaction) => Promise<T>,
    transaction?: Transaction,
  ): Promise<T> {
    if (transaction && !(transaction instanceof PrismaClient)) {
      throw new Error('Transaction should be a PrismaClient instance');
    }

    if (transaction) {
      return await fn(transaction);
    }

    return await this.prismaService.$transaction(async (prisma) => {
      return await fn(prisma);
    });
  }
}
