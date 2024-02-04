import { Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { EntityList } from 'src/modules/common/infra/repositories/EntityList';
import { Experience } from '../../application/entities/Experience.entity';
import { ExperienceRepository } from '../../application/repositories/ExperienceRepository';

@Injectable()
export class MemoryExperienceRepository extends ExperienceRepository {
  readonly items: EntityList<Experience>;

  constructor() {
    super();
    this.items = new EntityList<Experience>();
  }

  async add(experience: Experience): Promise<void> {
    this.items.add(experience);
  }
  async update(experience: Experience): Promise<void> {
    this.items.update(experience);
  }
  async delete(id: Id): Promise<void> {
    this.items.delete(id);
  }
  async findById(id: Id): Promise<Experience | null> {
    return this.items.findById(id);
  }
  async listByUserId(userId: Id): Promise<Experience[]> {
    return this.items.items.filter((e) => e.userId.isEqual(userId));
  }
}
