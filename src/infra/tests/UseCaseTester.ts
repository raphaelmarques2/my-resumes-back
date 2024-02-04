import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthTokenService } from 'src/modules/auth/application/services/AuthTokenService';
import { PasswordService } from 'src/modules/auth/application/services/PasswordService';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { cleanDatabase } from './db-fixtures';

export class UseCaseTester {
  prisma!: PrismaService;
  tempDdSchema!: string;

  private _jwtService?: JwtService;
  get jwtService(): JwtService {
    if (!this._jwtService) {
      this._jwtService = new JwtService({ secret: 'test' });
    }
    return this._jwtService;
  }

  private _authTokenService?: AuthTokenService;
  get authTokenService(): AuthTokenService {
    if (!this._authTokenService) {
      this._authTokenService = new AuthTokenService(this.jwtService);
    }
    return this._authTokenService;
  }

  private _passwordService?: PasswordService;
  get passwordService(): PasswordService {
    if (!this._passwordService) {
      this._passwordService = new PasswordService();
    }
    return this._passwordService;
  }
}

export function createUseCaseTester() {
  const tester = new UseCaseTester();
  beforeAll(async () => {
    if (!process.env.JEST_DATABASE_URL)
      throw new Error('No process.env.JEST_DATABASE_URL');
    if (!process.env.JEST_DATABASE_SCHEMA)
      throw new Error('No process.env.JEST_DATABASE_SCHEMA');

    const prisma = (tester.prisma = new PrismaClient({
      datasources: { db: { url: process.env.JEST_DATABASE_URL } },
    }) as PrismaService);
    tester.tempDdSchema = process.env.JEST_DATABASE_SCHEMA;
    await prisma.$connect();
  });
  beforeEach(async () => {
    await cleanDatabase(tester.prisma);
  });

  afterAll(async () => {
    await cleanDatabase(tester.prisma);
    await tester.prisma.$disconnect();
  });

  return tester;
}
