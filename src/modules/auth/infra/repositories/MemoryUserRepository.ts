import { Email } from 'src/modules/common/application/value-objects/Email';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { UserRepository } from '../../application/repositories/UserRepository';
import { User } from '../../application/entities/User.entity';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';

export class MemoryUserRepository extends UserRepository {
  readonly items: EntityList<User>;

  constructor() {
    super();
    this.items = new EntityList<User>();
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.items.findBy((e) => e.email.isEqual(email));
  }

  async findById(id: Id): Promise<User | null> {
    return this.items.findById(id);
  }

  async add(user: User): Promise<void> {
    this.items.add(user);
  }

  async userExists(id: Id): Promise<boolean> {
    return this.items.findById(id) !== null;
  }
}
