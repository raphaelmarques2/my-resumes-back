import { Injectable } from '@nestjs/common';
import {
  EmailService,
  UpdatePasswordPayload,
} from '../../application/services/EmailService';
import axios from 'axios';
import { MyConfigService } from 'src/infra/services/MyConfigService';

const TemplateIds = {
  UpdatePassword: 'd-ee9417a9354c416a905abbb2c66ee18b',
} as const;

@Injectable()
export class SendGridEmailService extends EmailService {
  constructor(private config: MyConfigService) {
    super();
  }

  async sendUpdatePasswordEmail(payload: UpdatePasswordPayload): Promise<void> {
    console.log('SendGridEmailService.sendUpdatePasswordEmail', payload);

    const url = 'https://api.sendgrid.com/v3/mail/send';
    const data = {
      personalizations: [
        {
          to: [{ email: payload.email.value }],
          dynamic_template_data: {
            token: payload.token,
          },
        },
      ],
      from: {
        email: this.config.sendgridFromEmail,
        name: this.config.sendgridFromName,
      },
      template_id: TemplateIds.UpdatePassword,
    };
    const headers = {
      Authorization: `Bearer ${this.config.sendgridKey}`,
      'Content-Type': 'application/json',
    };
    console.log('Sending email');
    console.log(data.personalizations[0].to);
    console.log(data.personalizations[0].dynamic_template_data);
    console.log(data);
    console.log(headers);
    await axios.post(url, data, { headers }).catch((reason) => {
      if (axios.isAxiosError(reason)) {
        console.log('axios error');
        console.log(reason.response?.data);
      }
    });
  }
}
