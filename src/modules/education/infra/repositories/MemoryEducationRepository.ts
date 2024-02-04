import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';
import { Education } from '../../application/entities/Education.entity';
import { EducationRepository } from '../../application/repositories/EducationRepository';

@Injectable()
export class MemoryEducationRepository extends EducationRepository {
  public items: EntityList<Education>;

  constructor() {
    super();
    this.items = new EntityList<Education>();
  }

  async findById(id: Id): Promise<Education | null> {
    return this.items.findById(id);
  }

  async add(education: Education): Promise<void> {
    this.items.add(education);
  }

  async update(education: Education): Promise<void> {
    this.items.update(education);
  }

  async listByUserId(userId: Id): Promise<Education[]> {
    return this.items.filterBy((e) => e.userId.isEqual(userId));
  }

  async delete(id: Id): Promise<void> {
    this.items.delete(id);
  }
}
