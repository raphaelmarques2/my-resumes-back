import { Injectable } from '@nestjs/common';
import { Email } from '../value-objects/Email';

export type UpdatePasswordPayload = {
  email: Email;
  token: string;
};

@Injectable()
export abstract class EmailService {
  abstract sendUpdatePasswordEmail(
    payload: UpdatePasswordPayload,
  ): Promise<void>;
}
