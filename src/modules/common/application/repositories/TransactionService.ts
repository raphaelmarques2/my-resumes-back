import { Injectable } from '@nestjs/common';

export type Transaction = object;

export type TransactionOptions = {
  transaction?: Transaction;
};

@Injectable()
export abstract class TransactionService {
  abstract transaction<T>(
    fn: (transaction: Transaction) => Promise<T>,
    transaction?: Transaction,
  ): Promise<T>;
}
