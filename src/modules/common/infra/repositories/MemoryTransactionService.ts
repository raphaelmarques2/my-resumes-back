import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionService,
} from '../../application/repositories/TransactionService';

@Injectable()
export class MemoryTransactionService implements TransactionService {
  async transaction<T>(
    fn: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return await fn(this);
  }
}
