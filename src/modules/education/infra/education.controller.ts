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
import { AuthGuard } from '../../auth/infra/guards/AuthGuard';
import { CreateEducationUseCase } from '../application/use-cases/create-education/create-education.usecase';
import { DeleteEducationUseCase } from '../application/use-cases/delete-education/delete-education.usecase';
import { GetEducationByIdUseCase } from '../application/use-cases/get-education-by-id/get-education-by-id.usecase';
import { ListUserEducationsUseCase } from '../application/use-cases/list-user-educations/list-user-educations.usecase';
import { UpdateEducationUseCase } from '../application/use-cases/update-education/update-education.usecase';
import { EducationDto } from '../application/entities/EducationDto';
import { UpdateEducationDto } from '../application/use-cases/update-education/UpdateEducationDto';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';

@ApiTags('educations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class EducationController {
  constructor(
    private createEducationUseCase: CreateEducationUseCase,
    private deleteEducationUseCase: DeleteEducationUseCase,
    private getEducationByIdUseCase: GetEducationByIdUseCase,
    private listUserEducationsUseCase: ListUserEducationsUseCase,
    private updateEducationUseCase: UpdateEducationUseCase,
  ) {}

  @Post('/educations')
  @ApiOperation({ operationId: 'createEducation' })
  @ApiCreatedResponse({ type: EducationDto })
  async createEducation(@Req() req: Request): Promise<EducationDto> {
    const auth = req['auth'] as AuthOutputDto;
    return this.createEducationUseCase.execute({ userId: auth.user.id });
  }

  @Get('/educations/:id')
  @ApiOperation({ operationId: 'getEducation' })
  @ApiOkResponse({ type: EducationDto })
  async getEducation(@Param('id') id: string): Promise<EducationDto> {
    return this.getEducationByIdUseCase.execute(id);
  }

  @Get('/educations')
  @ApiOperation({ operationId: 'listUserEducations' })
  @ApiOkResponse({ type: [EducationDto] })
  async listUserEducations(@Req() req: Request): Promise<EducationDto[]> {
    const auth = req['auth'] as AuthOutputDto;
    return this.listUserEducationsUseCase.execute(auth.user.id);
  }

  @Patch('/educations/:id')
  @ApiOperation({
    operationId: 'patchEducation',
  })
  @ApiDefaultResponse({ type: EducationDto })
  async patchEducation(
    @Param('id') id: string,
    @Body() body: UpdateEducationDto,
  ): Promise<EducationDto> {
    return this.updateEducationUseCase.execute(id, body);
  }

  @Delete('/educations/:id')
  @ApiOperation({ operationId: 'deleteEducation' })
  async deleteEducation(@Param('id') id: string): Promise<void> {
    return this.deleteEducationUseCase.execute(id);
  }
}
