import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MyConfigService } from 'src/infra/services/MyConfigService';
import { Transaction } from 'src/modules/common/application/repositories/TransactionService';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const isJest = Boolean(process.env.JEST_WORKER_ID);
    if (isJest) {
      const url = new MyConfigService().testDatabaseUrl;
      if (!url) throw new Error('Missing env.TEST_DATABASE_URL');
      super({ datasources: { db: { url } } });
    } else {
      super();
    }
  }

  useTransaction(transaction?: Transaction): PrismaService {
    if (transaction && !(transaction instanceof PrismaClient)) {
      throw new Error('Transaction should be a PrismaClient instance');
    }
    return (transaction as PrismaService) || this;
  }
}
