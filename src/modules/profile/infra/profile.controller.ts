import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProfileDto } from 'src/modules/profile/application/entities/ProfileDto';
import { UpdateProfileDto } from 'src/modules/profile/application/use-cases/update-profile/UpdateProfileDto';
import { AuthGuard } from '../../auth/infra/guards/AuthGuard';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile/get-user-profile.usecase';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile/update-profile.usecase';
import { AuthOutputDto } from 'src/modules/auth/application/use-cases/login/auth-output.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ProfileController {
  constructor(
    private getUserProfileUseCase: GetUserProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('/profile')
  @ApiOperation({ operationId: 'getProfileByUserId' })
  @ApiOkResponse({ type: ProfileDto })
  async getProfileByUserId(@Req() req: Request): Promise<ProfileDto> {
    const auth = req['auth'] as AuthOutputDto;
    return this.getUserProfileUseCase.execute(auth.user.id);
  }

  @Patch('/profiles/:id')
  @ApiOperation({ operationId: 'patchProfile' })
  @ApiOkResponse({ type: ProfileDto })
  async patch(
    @Param('id') id: string,
    @Body() body: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return this.updateProfileUseCase.execute(id, body);
  }
}
