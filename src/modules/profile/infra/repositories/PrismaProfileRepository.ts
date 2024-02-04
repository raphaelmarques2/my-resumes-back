import { Injectable } from '@nestjs/common';
import { Profile as ProfileData } from '@prisma/client';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { ProfileRepository } from '../../application/repositories/ProfileRepository';
import { Profile } from '../../application/entities/Profile.entity';

@Injectable()
export class PrismaProfileRepository extends ProfileRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async add(profile: Profile, options?: TransactionOptions): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).profile.create({
      data: {
        id: profile.id.value,
        userId: profile.userId.value,
        name: profile.name,
        email: profile.email,
        address: profile.address,
        linkedin: profile.linkedin,
      },
    });
  }

  async findByUserId(
    userId: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Profile | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .profile.findFirst({
        where: { userId: userId.value },
      });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async findById(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<Profile | null> {
    const data = await this.prisma
      .useTransaction(options?.transaction)
      .profile.findUnique({ where: { id: id.value } });
    if (!data) return null;
    return this.convertToEntity(data);
  }

  async update(
    profile: Profile,
    options?: TransactionOptions | undefined,
  ): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).profile.update({
      where: { id: profile.id.value },
      data: {
        name: profile.name,
        email: profile.email,
        address: profile.address,
        linkedin: profile.linkedin,
      },
    });
  }

  private convertToEntity(data: ProfileData): Profile {
    return Profile.load({
      id: new Id(data.id),
      userId: new Id(data.userId),
      name: data.name,
      email: data.email,
      address: data.address,
      linkedin: data.linkedin,
    });
  }
}
