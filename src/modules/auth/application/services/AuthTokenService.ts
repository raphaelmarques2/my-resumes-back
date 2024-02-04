import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export type TokenPayload = {
  userId: string;
  email: string;
};

type InternTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthTokenService {
  constructor(private jwtService: NestJwtService) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    const internPayload: InternTokenPayload = {
      sub: payload.userId,
      email: payload.email,
    };
    const token = await this.jwtService.signAsync(internPayload);
    return token;
  }

  async extractToken(token: string): Promise<TokenPayload> {
    const internPayload =
      await this.jwtService.verifyAsync<InternTokenPayload>(token);
    return {
      userId: internPayload.sub,
      email: internPayload.email,
    };
  }
}
