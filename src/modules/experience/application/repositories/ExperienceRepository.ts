import { Injectable } from '@nestjs/common';
import { Experience } from '../entities/Experience.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';

@Injectable()
export abstract class ExperienceRepository {
  abstract add(
    experience: Experience,
    options?: TransactionOptions,
  ): Promise<void>;
  abstract update(
    experience: Experience,
    options?: TransactionOptions,
  ): Promise<void>;
  abstract delete(id: Id, options?: TransactionOptions): Promise<void>;
  abstract findById(
    id: Id,
    options?: TransactionOptions,
  ): Promise<Experience | null>;
  abstract listByUserId(
    userId: Id,
    options?: TransactionOptions,
  ): Promise<Experience[]>;
}
