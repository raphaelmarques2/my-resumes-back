import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';
import { ResumeDto } from 'src/modules/resume/application/entities/ResumeDto';
import { UpdateResumeDto } from 'src/modules/resume/application/use-cases/update-resume/UpdateResumeDto';
import { AuthGuard } from '../../auth/infra/guards/AuthGuard';
import { CreateResumeUseCase } from '../application/use-cases/create-resume/create-resume.usecase';
import { DeleteResumeUseCase } from '../application/use-cases/delete-resume/delete-resume.usecase';
import { GetResumeByIdUseCase } from '../application/use-cases/get-resume-by-id/get-resume-by-id.usecase';
import { ListUserResumesUseCase } from '../application/use-cases/list-user-resumes/list-user-resumes.usecase';
import { UpdateResumeUseCase } from '../application/use-cases/update-resume/update-resume.usecase';
import { CreateResumeExampleUseCase } from '../application/use-cases/create-resume-example/create-resume-example.usecase';

@ApiTags('resumes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ResumeController {
  constructor(
    private createResumeUseCase: CreateResumeUseCase,
    private deleteResumeUseCase: DeleteResumeUseCase,
    private getResumeByIdUseCase: GetResumeByIdUseCase,
    private listUserResumesUseCase: ListUserResumesUseCase,
    private updateResumeUseCase: UpdateResumeUseCase,
    private createResumeExampleUseCase: CreateResumeExampleUseCase,
  ) {}

  @Post('/resumes')
  @ApiOperation({ operationId: 'createResume' })
  @ApiCreatedResponse({ type: ResumeDto })
  async createResume(@Req() req: Request): Promise<ResumeDto> {
    const auth = req['auth'] as AuthOutputDto;
    return this.createResumeUseCase.execute({ userId: auth.user.id });
  }

  @Post('/resumes/example')
  @ApiOperation({ operationId: 'createResumeExample' })
  async createResumeExample(@Req() req: Request): Promise<void> {
    const auth = req['auth'] as AuthOutputDto;
    await this.createResumeExampleUseCase.execute({ userId: auth.user.id });
  }

  @Get('/resumes/:id')
  @ApiOperation({ operationId: 'getResumeById' })
  @ApiOkResponse({ type: ResumeDto })
  async getById(@Param('id') id: string): Promise<ResumeDto> {
    return this.getResumeByIdUseCase.execute(id);
  }

  @Get('/resumes')
  @ApiOperation({ operationId: 'listUserResumes' })
  @ApiOkResponse({ type: [ResumeDto] })
  async listUserResumes(@Req() req: Request): Promise<ResumeDto[]> {
    const auth = req['auth'] as AuthOutputDto;
    return this.listUserResumesUseCase.execute(auth.user.id);
  }

  @Patch('/resumes/:id')
  @ApiOperation({ operationId: 'patchResume' })
  @ApiOkResponse({ type: ResumeDto })
  async patch(
    @Param('id') id: string,
    @Body() body: UpdateResumeDto,
  ): Promise<ResumeDto> {
    return this.updateResumeUseCase.execute(id, body);
  }

  @Delete('/resumes/:id')
  @ApiOperation({ operationId: 'deleteResume' })
  @ApiCreatedResponse()
  async deleteResume(@Param('id') id: string): Promise<void> {
    return this.deleteResumeUseCase.execute(id);
  }
}
