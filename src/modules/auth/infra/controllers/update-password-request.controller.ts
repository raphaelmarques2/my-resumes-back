import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../application/entities/User.dto';
import { RequestPasswordResetDto } from '../../application/use-cases/request-password-reset/request-password-reset.dto';
import { RequestPasswordResetUseCase } from '../../application/use-cases/request-password-reset/request-password-reset.usecase';
import { UpdatePasswordByResetTokenUseCase } from '../../application/use-cases/update-password-by-reset-token/update-password-by-reset-token.usecase';
import { ValidatePasswordResetTokenUseCase } from '../../application/use-cases/validate-password-reset-token/validate-password-reset-token.usecase';

@ApiTags('updatePasswordPequest')
@Controller('/auth/password-reset')
export class UpdatePasswordRequestController {
  constructor(
    private requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private validatePasswordResetTokenUseCase: ValidatePasswordResetTokenUseCase,
    private updatePasswordByResetTokenUseCase: UpdatePasswordByResetTokenUseCase,
  ) {}

  @Post('')
  async requestPasswordReset(
    @Body() body: RequestPasswordResetDto,
  ): Promise<void> {
    console.log('UpdatePasswordRequestController.requestPasswordReset', body);
    await this.requestPasswordResetUseCase.execute(body);
  }

  @Get('/:token')
  async validatePasswordResetToken(
    @Param('token') token: string,
  ): Promise<UserDto> {
    return await this.validatePasswordResetTokenUseCase.execute(token);
  }

  @Post('/:token/update-password')
  @HttpCode(HttpStatus.OK)
  async updatePasswordByResetToken(
    @Param('token') token: string,
    @Body('password') password: string,
  ): Promise<void> {
    await this.updatePasswordByResetTokenUseCase.execute({
      token,
      password: password,
    });
  }
}
