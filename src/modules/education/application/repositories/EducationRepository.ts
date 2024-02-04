import { Injectable } from '@nestjs/common';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Education } from '../entities/Education.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export abstract class EducationRepository {
  abstract findById(
    id: Id,
    options?: TransactionOptions,
  ): Promise<Education | null>;

  abstract add(
    education: Education,
    options?: TransactionOptions,
  ): Promise<void>;

  abstract update(
    education: Education,
    options?: TransactionOptions,
  ): Promise<void>;

  abstract listByUserId(
    userId: Id,
    options?: TransactionOptions,
  ): Promise<Education[]>;

  abstract delete(id: Id, options?: TransactionOptions): Promise<void>;
}
