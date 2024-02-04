import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './infra/controllers/app.controller';
import { LoggerMiddleware } from './infra/middlewares/LoggerMiddleware';
import { LoggingInterceptor } from './infra/middlewares/LoggingInterceptor';
import {
  MyConfigService,
  configurations,
} from './infra/services/MyConfigService';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionService } from './modules/common/application/repositories/TransactionService';
import { PrismaService } from './modules/common/infra/services/PrismaService';
import { PrismaTransactionService } from './modules/common/infra/repositories/PrismaTransactionService';
import { EducationModule } from './modules/education/education.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ResumeModule } from './modules/resume/resume.module';
import { SendGridEmailService } from './modules/common/infra/services/SendGridEmailService';
import { EmailService } from './modules/common/application/services/EmailService';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),
    ResumeModule,
    ProfileModule,
    ExperienceModule,
    EducationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    MyConfigService,
    LoggerMiddleware,
    LoggingInterceptor,
    PrismaService,
    { provide: TransactionService, useClass: PrismaTransactionService },
    { provide: EmailService, useClass: SendGridEmailService },
  ],
  exports: [PrismaService, TransactionService, EmailService],
})
export class AppModule {}
