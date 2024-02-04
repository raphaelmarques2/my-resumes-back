import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';
import { LoginDto } from 'src/modules/auth/application/use-cases/login/login.dto';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login/login.usecase';
import { SignupDto } from 'src/modules/auth/application/use-cases/signup/signup.dto';
import { SignupUseCase } from 'src/modules/auth/application/use-cases/signup/signup.usecase';
import { ValidateTokenUseCase } from 'src/modules/auth/application/use-cases/validate-token/validate-token.usecase';
import { AuthGuard } from '../guards/AuthGuard';
import { UserDto } from 'src/modules/auth/application/entities/User.dto';
import { UpdatePasswordUseCase } from '../../application/use-cases/update-password/update-password.usecase';
import { UpdatePasswordDto } from '../../application/use-cases/update-password/update-password.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase,
    private loginUseCase: LoginUseCase,
    private validateTokenUseCase: ValidateTokenUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
  ) {}

  @Post('/signup')
  @ApiOperation({ operationId: 'signup' })
  @ApiCreatedResponse({ type: AuthOutputDto })
  async signup(@Body() body: SignupDto): Promise<AuthOutputDto> {
    return this.signupUseCase.execute(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ operationId: 'login' })
  @ApiCreatedResponse({ type: AuthOutputDto })
  async login(@Body() body: LoginDto): Promise<AuthOutputDto> {
    return this.loginUseCase.execute(body);
  }

  @UseGuards(AuthGuard)
  @Post('/validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'authenticate' })
  @ApiOkResponse({ type: AuthOutputDto })
  async authenticate(@Req() req: Request): Promise<AuthOutputDto> {
    const [, token] = req.headers.authorization?.split(' ') ?? [];
    return this.validateTokenUseCase.execute(token);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  @ApiOperation({ operationId: 'getMe' })
  @ApiOkResponse({ type: UserDto })
  async getMe(@Req() req: Request) {
    const auth = req['auth'] as AuthOutputDto | undefined;
    if (!auth) throw new UnauthorizedException();
    return auth.user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'updatePassword' })
  @ApiOkResponse()
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const auth = req['auth'] as AuthOutputDto | undefined;
    if (!auth) throw new UnauthorizedException();

    await this.updatePasswordUseCase.execute(auth.user.id, body);
  }
}
