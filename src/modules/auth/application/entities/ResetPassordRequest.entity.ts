import * as moment from 'moment';
import { Id } from 'src/modules/common/application/value-objects/Id';

export class ResetPasswordRequest {
  private constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly expiresAt: Date,
    public readonly token: Id,
    public active: boolean,
  ) {}

  isValid(): boolean {
    const isExpired = moment(this.expiresAt).isBefore(moment());
    return this.active && !isExpired;
  }

  static create({ userId }: { userId: Id }) {
    const expiresAt = moment().add(2, 'days').toDate();
    return new ResetPasswordRequest(
      new Id(),
      userId,
      expiresAt,
      new Id(),
      true,
    );
  }

  static load({
    id,
    userId,
    expiresAt,
    token,
    active,
  }: {
    id: Id;
    userId: Id;
    expiresAt: Date;
    token: Id;
    active: boolean;
  }) {
    return new ResetPasswordRequest(id, userId, expiresAt, token, active);
  }
}
