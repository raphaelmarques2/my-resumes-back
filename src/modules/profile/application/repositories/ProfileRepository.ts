import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Profile } from '../entities/Profile.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ProfileRepository {
  abstract add(profile: Profile, options?: TransactionOptions): Promise<void>;

  abstract findByUserId(
    userId: Id,
    options?: TransactionOptions,
  ): Promise<Profile | null>;

  abstract findById(
    id: Id,
    options?: TransactionOptions,
  ): Promise<Profile | null>;

  abstract update(
    profile: Profile,
    options?: TransactionOptions,
  ): Promise<void>;
}
