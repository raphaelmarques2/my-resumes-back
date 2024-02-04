import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ValidateTokenUseCase } from 'src/modules/auth/application/use-cases/validate-token/validate-token.usecase';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private validateTokenUseCase: ValidateTokenUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const authOutput = await this.validateTokenUseCase.execute(token);
      request['auth'] = authOutput;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
