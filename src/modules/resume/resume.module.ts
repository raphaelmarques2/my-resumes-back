import { Module } from '@nestjs/common';
import { ResumeController } from './infra/resume.controller';
import { ResumeRepository } from './application/repositories/ResumeRepository';
import { PrismaResumeRepository } from './infra/repositories/PrismaResumeRepository';
import { CreateResumeUseCase } from './application/use-cases/create-resume/create-resume.usecase';
import { DeleteResumeUseCase } from './application/use-cases/delete-resume/delete-resume.usecase';
import { GetResumeByIdUseCase } from './application/use-cases/get-resume-by-id/get-resume-by-id.usecase';
import { ListUserResumesUseCase } from './application/use-cases/list-user-resumes/list-user-resumes.usecase';
import { UpdateResumeUseCase } from './application/use-cases/update-resume/update-resume.usecase';
import { CreateResumeExampleUseCase } from './application/use-cases/create-resume-example/create-resume-example.usecase';
import { EducationModule } from '../education/education.module';
import { ExperienceModule } from '../experience/experience.module';

@Module({
  imports: [EducationModule, ExperienceModule],
  controllers: [ResumeController],
  providers: [
    { provide: ResumeRepository, useClass: PrismaResumeRepository },
    CreateResumeUseCase,
    DeleteResumeUseCase,
    GetResumeByIdUseCase,
    ListUserResumesUseCase,
    UpdateResumeUseCase,
    CreateResumeExampleUseCase,
  ],
})
export class ResumeModule {}
