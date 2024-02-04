import { Id } from 'src/modules/common/application/value-objects/Id';
import { ProfileRepository } from '../../application/repositories/ProfileRepository';
import { Profile } from '../../application/entities/Profile.entity';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';

export class MemoryProfileRepository extends ProfileRepository {
  readonly items: EntityList<Profile>;

  constructor() {
    super();
    this.items = new EntityList<Profile>();
  }

  async add(profile: Profile): Promise<void> {
    this.items.add(profile);
  }

  async findByUserId(userId: Id): Promise<Profile | null> {
    return this.items.findBy((e) => e.userId.isEqual(userId));
  }

  async findById(id: Id): Promise<Profile | null> {
    return this.items.findById(id);
  }

  async update(profile: Profile): Promise<void> {
    this.items.update(profile);
  }
}
