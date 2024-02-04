import { Entity } from 'src/modules/common/application/value-objects/Entity';
import { Id } from 'src/modules/common/application/value-objects/Id';

export class Profile implements Entity {
  private constructor(
    readonly id: Id,
    readonly userId: Id,
    public name: string,
    public email: string,
    public address: string | null,
    public linkedin: string | null,
  ) {}

  update(input: {
    name?: string;
    email?: string;
    address?: string;
    linkedin?: string;
  }) {
    if (input.name !== undefined) this.name = input.name;
    if (input.email !== undefined) this.email = input.email;
    if (input.address !== undefined) this.address = input.address;
    if (input.linkedin !== undefined) this.linkedin = input.linkedin;
  }

  static create({
    userId,
    name,
    email,
  }: {
    userId: Id;
    name: string;
    email: string;
  }) {
    return new Profile(new Id(), userId, name, email, null, null);
  }

  static load({
    id,
    userId,
    name,
    email,
    address,
    linkedin,
  }: {
    id: Id;
    userId: Id;
    name: string;
    email: string;
    address: string | null;
    linkedin: string | null;
  }): Profile {
    return new Profile(id, userId, name, email, address, linkedin);
  }
}
