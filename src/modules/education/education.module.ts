import { Module } from '@nestjs/common';
import { EducationController } from './infra/education.controller';
import { EducationRepository } from './application/repositories/EducationRepository';
import { PrismaEducationRepository } from './infra/repositories/PrismaEducationRepository';
import { CreateEducationUseCase } from './application/use-cases/create-education/create-education.usecase';
import { DeleteEducationUseCase } from './application/use-cases/delete-education/delete-education.usecase';
import { GetEducationByIdUseCase } from './application/use-cases/get-education-by-id/get-education-by-id.usecase';
import { ListUserEducationsUseCase } from './application/use-cases/list-user-educations/list-user-educations.usecase';
import { UpdateEducationUseCase } from './application/use-cases/update-education/update-education.usecase';

@Module({
  imports: [],
  controllers: [EducationController],
  providers: [
    { provide: EducationRepository, useClass: PrismaEducationRepository },
    CreateEducationUseCase,
    DeleteEducationUseCase,
    GetEducationByIdUseCase,
    ListUserEducationsUseCase,
    UpdateEducationUseCase,
  ],
  exports: [EducationRepository],
})
export class EducationModule {}
