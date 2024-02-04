import { Injectable } from '@nestjs/common';
import {
  EmailService,
  UpdatePasswordPayload,
} from '../../application/services/EmailService';

@Injectable()
export class MemoryEmailService extends EmailService {
  emailsSent: UpdatePasswordPayload[];

  constructor() {
    super();
    this.emailsSent = [];
  }

  async sendUpdatePasswordEmail(payload: UpdatePasswordPayload): Promise<void> {
    this.emailsSent.push(payload);
  }
}
