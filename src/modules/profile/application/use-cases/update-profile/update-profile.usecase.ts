import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileDto } from '../../entities/ProfileDto';
import { UpdateProfileDto, updateProfileDtoSchema } from './UpdateProfileDto';
import {
  validateDto,
  validateId,
} from 'src/modules/common/application/validation';
import { TransactionService } from 'src/modules/common/application/repositories/TransactionService';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { Id } from 'src/modules/common/application/value-objects/Id';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    private transactionService: TransactionService,
    private profileRepository: ProfileRepository,
  ) {}

  async execute(id: string, input: UpdateProfileDto): Promise<ProfileDto> {
    validateId(id);
    validateDto(input, updateProfileDtoSchema);

    const updatedProfile = await this.transactionService.transaction(
      async (transaction) => {
        const profile = await this.profileRepository.findById(
          new Id(id),
          transaction,
        );
        if (!profile) {
          throw new NotFoundException();
        }

        profile.update(input);

        await this.profileRepository.update(profile, transaction);

        return profile;
      },
    );

    return ProfileDto.createFrom(updatedProfile);
  }
}
