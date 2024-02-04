import { Module } from '@nestjs/common';
import { ExperienceController } from './infra/experience.controller';
import { CreateExperienceUseCase } from './application/use-cases/create-experience/create-experience.usecase';
import { DeleteExperienceUseCase } from './application/use-cases/delete-experience/delete-experience.usecase';
import { GetExperienceByIdUseCase } from './application/use-cases/get-experience-by-id/get-experience-by-id.usecase';
import { ListUserExperiencesUseCase } from './application/use-cases/list-user-experiences/list-user-experiences.usecase';
import { UpdateExperienceUseCase } from './application/use-cases/update-experience/udpate-experience.usecase';
import { ExperienceRepository } from './application/repositories/ExperienceRepository';
import { PrismaExperienceRepository } from './infra/repositories/PrismaExperienceRepository';

@Module({
  imports: [],
  controllers: [ExperienceController],
  providers: [
    { provide: ExperienceRepository, useClass: PrismaExperienceRepository },
    CreateExperienceUseCase,
    DeleteExperienceUseCase,
    GetExperienceByIdUseCase,
    ListUserExperiencesUseCase,
    UpdateExperienceUseCase,
  ],
  exports: [ExperienceRepository],
})
export class ExperienceModule {}
