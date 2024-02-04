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
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExperienceDto } from 'src/modules/experience/application/entities/ExperienceDto';
import { UpdateExperienceDto } from 'src/modules/experience/application/use-cases/update-experience/UpdateExperienceDto';
import { AuthGuard } from '../../auth/infra/guards/AuthGuard';
import { CreateExperienceUseCase } from '../application/use-cases/create-experience/create-experience.usecase';
import { DeleteExperienceUseCase } from '../application/use-cases/delete-experience/delete-experience.usecase';
import { GetExperienceByIdUseCase } from '../application/use-cases/get-experience-by-id/get-experience-by-id.usecase';
import { ListUserExperiencesUseCase } from '../application/use-cases/list-user-experiences/list-user-experiences.usecase';
import { UpdateExperienceUseCase } from '../application/use-cases/update-experience/udpate-experience.usecase';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';

@ApiTags('experiences')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ExperienceController {
  constructor(
    private createExperienceUseCase: CreateExperienceUseCase,
    private deleteExperienceUseCase: DeleteExperienceUseCase,
    private getExperienceByIdUseCase: GetExperienceByIdUseCase,
    private listUserExperiencesUseCase: ListUserExperiencesUseCase,
    private updateExperienceUseCase: UpdateExperienceUseCase,
  ) {}

  @Post('/experiences')
  @ApiOperation({ operationId: 'createExperience' })
  @ApiCreatedResponse({ type: ExperienceDto })
  async createExperience(@Req() req: Request): Promise<ExperienceDto> {
    const auth = req['auth'] as AuthOutputDto;
    return this.createExperienceUseCase.execute({ userId: auth.user.id });
  }

  @Get('/experiences/:id')
  @ApiOperation({ operationId: 'getExperience' })
  @ApiOkResponse({ type: ExperienceDto })
  async getExperience(@Param('id') id: string): Promise<ExperienceDto> {
    return this.getExperienceByIdUseCase.execute(id);
  }

  @Get('/experiences')
  @ApiOperation({ operationId: 'listUserExperiences' })
  @ApiOkResponse({ type: [ExperienceDto] })
  async listUserExperiences(@Req() req: Request): Promise<ExperienceDto[]> {
    const auth = req['auth'] as AuthOutputDto;
    return this.listUserExperiencesUseCase.execute(auth.user.id);
  }

  @Patch('/experiences/:id')
  @ApiOperation({
    operationId: 'patchExperience',
  })
  @ApiDefaultResponse({ type: ExperienceDto })
  async patchExperience(
    @Param('id') id: string,
    @Body() body: UpdateExperienceDto,
  ): Promise<ExperienceDto> {
    return this.updateExperienceUseCase.execute(id, body);
  }

  @Delete('/experiences/:id')
  @ApiOperation({ operationId: 'deleteExperience' })
  async deleteExperience(@Param('id') id: string): Promise<void> {
    return this.deleteExperienceUseCase.execute(id);
  }
}
