import { BadRequestException, Injectable } from '@nestjs/common';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { UserDto } from '../../entities/User.dto';
import { ResetPasswordRequestRepository } from '../../repositories/ResetPasswordRequestRepository';
import { UserRepository } from '../../repositories/UserRepository';

@Injectable()
export class ValidatePasswordResetTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private resetPasswordRequestRepository: ResetPasswordRequestRepository,
  ) {}

  async execute(token: string): Promise<UserDto> {
    const request = await this.resetPasswordRequestRepository.findByToken(
      new Id(token),
    );

    if (!request) throw new BadRequestException('Invalid token');

    if (!request.isValid()) throw new BadRequestException('Invalid token');

    const user = await this.userRepository.findById(request.userId);

    if (!user) throw new BadRequestException('Invalid token');

    return UserDto.createFrom(user);
  }
}
