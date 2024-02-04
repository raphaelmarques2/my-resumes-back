import { Entity } from '../../application/value-objects/Entity';
import { Id } from '../../application/value-objects/Id';

export class EntityList<E extends Entity> {
  public items: E[];

  constructor() {
    this.items = [];
  }

  findById(id: Id): E | null {
    const item = this.items.find((e) => e.id.isEqual(id));
    return item || null;
  }
  findBy(fn: (e: E) => boolean): E | null {
    const item = this.items.find(fn);
    return item || null;
  }
  delete(id: Id): void {
    this.items = this.items.filter((e) => !e.id.isEqual(id));
  }
  update(entity: E): void {
    const index = this.items.findIndex((e) => e.id.isEqual(entity.id));
    if (index < 0) throw new Error('Entity not found');
    this.items[index] = entity;
  }
  add(entity: E): void {
    const index = this.items.findIndex((e) => e.id.isEqual(entity.id));
    if (index >= 0) throw new Error('Entity already exist');
    this.items.push(entity);
  }
  filterBy(fn: (e: E) => boolean): E[] {
    return this.items.filter(fn);
  }
}
