import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionService,
} from 'src/modules/common/application/repositories/TransactionService';
import { validateDto } from 'src/modules/common/application/validation';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Credential } from '../../entities/Credential.entity';
import { CredentialRepository } from '../../repositories/CredentialRepository';
import { ResetPasswordRequestRepository } from '../../repositories/ResetPasswordRequestRepository';
import { PasswordService } from '../../services/PasswordService';
import {
  UpdatePasswordByResetTokenDto,
  updatePasswordByResetTokenDtoSchema,
} from './update-password-by-reset-token.dto';

@Injectable()
export class UpdatePasswordByResetTokenUseCase {
  constructor(
    private transactionService: TransactionService,
    private credentialRepository: CredentialRepository,
    private passwordService: PasswordService,
    private resetPasswordRequestRepository: ResetPasswordRequestRepository,
  ) {}

  async execute(input: UpdatePasswordByResetTokenDto): Promise<void> {
    validateDto(input, updatePasswordByResetTokenDtoSchema);
    await this.transactionService.transaction(async (transaction) => {
      const request = await this.resetPasswordRequestRepository.findByToken(
        new Id(input.token),
        { transaction },
      );
      if (!request) throw new BadRequestException('Invalid token');
      if (!request.isValid()) throw new BadRequestException('Invalid token');
      await this.updateOrCreateCredential({
        userId: request.userId,
        newPassword: input.password,
        transaction,
      });
      request.active = false;
      await this.resetPasswordRequestRepository.update(request, {
        transaction,
      });
    });
  }

  private async updateOrCreateCredential({
    userId,
    newPassword,
    transaction,
  }: {
    userId: Id;
    newPassword: string;
    transaction: Transaction;
  }) {
    const passwordHash = await this.passwordService.hashPassword(newPassword);
    const credential = await this.credentialRepository.findByUserId(userId, {
      transaction,
    });
    if (credential) {
      credential.password = passwordHash;
      await this.credentialRepository.update(credential, { transaction });
    } else {
      const newCredential = Credential.create({
        userId: userId,
        password: passwordHash,
      });
      await this.credentialRepository.add(newCredential, { transaction });
    }
  }
}
