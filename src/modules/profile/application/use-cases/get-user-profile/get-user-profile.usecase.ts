import { validateId } from 'src/modules/common/application/validation';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileDto } from '../../entities/ProfileDto';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(userId: string): Promise<ProfileDto> {
    validateId(userId);

    const profile = await this.profileRepository.findByUserId(new Id(userId));
    if (!profile) {
      throw new NotFoundException();
    }

    return ProfileDto.createFrom(profile);
  }
}
