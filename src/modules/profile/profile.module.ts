import { Module } from '@nestjs/common';
import { ProfileController } from './infra/profile.controller';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile/get-user-profile.usecase';
import { UpdateProfileUseCase } from './application/use-cases/update-profile/update-profile.usecase';
import { ProfileRepository } from './application/repositories/ProfileRepository';
import { PrismaProfileRepository } from './infra/repositories/PrismaProfileRepository';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [
    { provide: ProfileRepository, useClass: PrismaProfileRepository },
    GetUserProfileUseCase,
    UpdateProfileUseCase,
  ],
  exports: [ProfileRepository],
})
export class ProfileModule {}
