import { BadRequestException, Injectable } from '@nestjs/common';
import {
  validateDto,
  validateId,
} from 'src/modules/common/application/validation';
import {
  UpdatePasswordDto,
  updatePasswordDtoSchema,
} from 'src/modules/auth/application/use-cases/update-password/update-password.dto';
import { Credential } from 'src/modules/auth/application/entities/Credential.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { UserRepository } from '../../repositories/UserRepository';
import { CredentialRepository } from '../../repositories/CredentialRepository';
import { PasswordService } from '../../services/PasswordService';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private credentialRepository: CredentialRepository,
    private passwordService: PasswordService,
  ) {}

  async execute(userId: string, input: UpdatePasswordDto): Promise<void> {
    validateId(userId);
    validateDto(input, updatePasswordDtoSchema);

    const user = await this.userRepository.findById(new Id(userId));
    if (!user) throw new BadRequestException('User not found');

    const newPasswordHash = await this.passwordService.hashPassword(
      input.newPassword,
    );

    const credential = await this.credentialRepository.findByUserId(user.id);
    if (!credential) {
      const newCredential = Credential.create({
        userId: user.id,
        password: newPasswordHash,
      });
      await this.credentialRepository.add(newCredential);
      return;
    }

    const validPassword = await this.passwordService.comparePasswords(
      input.currentPassword,
      credential.password,
    );
    if (!validPassword) {
      throw new BadRequestException('Invalid current password');
    }

    credential.password = newPasswordHash;
    await this.credentialRepository.update(credential);
  }
}
