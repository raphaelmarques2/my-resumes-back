import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthOutputDto } from '../login/auth-output.dto';
import { AuthTokenService } from 'src/modules/auth/application/services/AuthTokenService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { UserDto } from 'src/modules/auth/application/entities/User.dto';
import { UserRepository } from '../../repositories/UserRepository';

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private authTokenService: AuthTokenService,
  ) {}

  async execute(token: string): Promise<AuthOutputDto> {
    const tokenData = await this.authTokenService
      .extractToken(token)
      .catch(() => {
        throw new UnauthorizedException();
      });

    const user = await this.userRepository.findById(new Id(tokenData.userId));
    if (!user) {
      throw new UnauthorizedException();
    }

    const newToken = await this.authTokenService.generateToken({
      userId: user.id.value,
      email: user.email.value,
    });

    return {
      token: newToken,
      user: UserDto.createFrom(user),
    };
  }
}
