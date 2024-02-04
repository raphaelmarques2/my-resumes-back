import { Id } from '../../../common/application/value-objects/Id';
import { Name } from '../../../common/application/value-objects/Name';
import { Email } from '../../../common/application/value-objects/Email';

export class User {
  private constructor(
    public readonly id: Id,
    public name: Name,
    public email: Email,
  ) {}

  static create({ name, email }: { name: Name; email: Email }) {
    return new User(new Id(), name, email);
  }
  static load({ id, name, email }: { id: Id; name: Name; email: Email }) {
    return new User(id, name, email);
  }
}
