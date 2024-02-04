import { Email } from 'src/modules/common/application/value-objects/Email';
import { User } from '../entities/User.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class UserRepository {
  abstract findByEmail(
    email: Email,
    options?: TransactionOptions,
  ): Promise<User | null>;

  abstract findById(id: Id, options?: TransactionOptions): Promise<User | null>;

  abstract add(user: User, options?: TransactionOptions): Promise<void>;

  abstract userExists(id: Id, options?: TransactionOptions): Promise<boolean>;
}
