import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Resume } from '../entities/Resume.entity';
import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export abstract class ResumeRepository {
  abstract add(resume: Resume, options?: TransactionOptions): Promise<void>;
  abstract update(resume: Resume, options?: TransactionOptions): Promise<void>;
  abstract delete(id: Id, options?: TransactionOptions): Promise<void>;
  abstract findById(
    id: Id,
    options?: TransactionOptions,
  ): Promise<Resume | null>;
  abstract listByUserId(
    userId: Id,
    options?: TransactionOptions,
  ): Promise<Resume[]>;
}
