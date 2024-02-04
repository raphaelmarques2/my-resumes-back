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
    console.log('RequestPasswordResetUseCase.execute 1', input);

    validateDto(input, requestPasswordResetDtoSchema);

    console.log('RequestPasswordResetUseCase.execute 2');

    const user = await this.userRepository.findByEmail(new Email(input.email));
    if (!user) return;

    console.log('RequestPasswordResetUseCase.execute 3', user);

    const request = ResetPasswordRequest.create({ userId: user.id });

    console.log('RequestPasswordResetUseCase.execute 4', request);

    await this.resetPasswordRequestRepository.add(request);

    console.log('RequestPasswordResetUseCase.execute 5');

    await this.emailService.sendUpdatePasswordEmail({
      email: new Email(input.email),
      token: request.token.value,
    });

    console.log('RequestPasswordResetUseCase.execute 6');
  }
}
