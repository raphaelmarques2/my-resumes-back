import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { ResetPasswordRequestRepository } from '../../repositories/ResetPasswordRequestRepository';
import { Email } from 'src/modules/common/application/value-objects/Email';
import { ResetPasswordRequest } from '../../entities/ResetPassordRequest.entity';
import { EmailService } from 'src/modules/common/application/services/EmailService';
import {
  RequestPasswordResetDto,
  requestPasswordResetDtoSchema,
} from './request-password-reset.dto';
import { validateDto } from 'src/modules/common/application/validation';

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    private userRepository: UserRepository,
    private resetPasswordRequestRepository: ResetPasswordRequestRepository,
    private emailService: EmailService,
  ) {}

  async execute(input: RequestPasswordResetDto): Promise<void> {
    validateDto(input, requestPasswordResetDtoSchema);

    const user = await this.userRepository.findByEmail(new Email(input.email));
    if (!user) return;

    const request = ResetPasswordRequest.create({ userId: user.id });

    await this.resetPasswordRequestRepository.add(request);

    await this.emailService.sendUpdatePasswordEmail({
      email: new Email(input.email),
      token: request.token.value,
    });
  }
}
