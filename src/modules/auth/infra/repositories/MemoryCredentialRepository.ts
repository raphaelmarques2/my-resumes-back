import { Id } from 'src/modules/common/application/value-objects/Id';
import { CredentialRepository } from '../../application/repositories/CredentialRepository';
import { Credential } from '../../application/entities/Credential.entity';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';

export class MemoryCredentialRepository extends CredentialRepository {
  readonly items: EntityList<Credential>;

  constructor() {
    super();
    this.items = new EntityList<Credential>();
  }

  async findByUserId(userId: Id): Promise<Credential | null> {
    return this.items.findBy((e) => e.userId.isEqual(userId));
  }

  async add(credential: Credential): Promise<void> {
    this.items.add(credential);
  }

  async update(credential: Credential): Promise<void> {
    this.items.update(credential);
  }
}
