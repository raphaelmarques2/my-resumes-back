import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { ResetPasswordRequest } from '../entities/ResetPassordRequest.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ResetPasswordRequestRepository {
  abstract findByToken(
    token: Id,
    options?: TransactionOptions,
  ): Promise<ResetPasswordRequest | null>;

  abstract add(
    request: ResetPasswordRequest,
    options?: TransactionOptions,
  ): Promise<void>;

  abstract update(
    request: ResetPasswordRequest,
    options?: TransactionOptions,
  ): Promise<void>;
}
