import { Injectable } from '@nestjs/common';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';
import { ResetPasswordRequest } from '../../application/entities/ResetPassordRequest.entity';
import { ResetPasswordRequestRepository } from '../../application/repositories/ResetPasswordRequestRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class MemoryResetPasswordRequestRepository extends ResetPasswordRequestRepository {
  readonly items: EntityList<ResetPasswordRequest>;

  constructor() {
    super();
    this.items = new EntityList<ResetPasswordRequest>();
  }

  async findByToken(token: Id): Promise<ResetPasswordRequest | null> {
    return this.items.findBy((e) => e.token.isEqual(token));
  }
  async add(request: ResetPasswordRequest): Promise<void> {
    this.items.add(request);
  }
  async update(request: ResetPasswordRequest): Promise<void> {
    this.items.update(request);
  }
}
