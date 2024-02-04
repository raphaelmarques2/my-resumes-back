import { Injectable } from '@nestjs/common';
import { User as UserData } from '@prisma/client';
import { TransactionOptions } from 'src/modules/common/application/repositories/TransactionService';
import { Email } from 'src/modules/common/application/value-objects/Email';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { PrismaService } from 'src/modules/common/infra/services/PrismaService';
import { User } from '../../application/entities/User.entity';
import { UserRepository } from '../../application/repositories/UserRepository';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findByEmail(
    email: Email,
    options?: TransactionOptions,
  ): Promise<User | null> {
    const user = await this.prisma
      .useTransaction(options?.transaction)
      .user.findUnique({
        where: { email: email.value },
      });
    if (!user) return null;

    return this.convertToEntity(user);
  }

  async findById(id: Id, options?: TransactionOptions): Promise<User | null> {
    const user = await this.prisma
      .useTransaction(options?.transaction)
      .user.findUnique({
        where: { id: id.value },
      });
    if (!user) return null;

    return this.convertToEntity(user);
  }

  async userExists(
    id: Id,
    options?: TransactionOptions | undefined,
  ): Promise<boolean> {
    const user = await this.prisma
      .useTransaction(options?.transaction)
      .user.findUnique({
        where: { id: id.value },
        select: { id: true },
      });
    return user !== null;
  }

  async add(user: User, options?: TransactionOptions): Promise<void> {
    await this.prisma.useTransaction(options?.transaction).user.create({
      data: {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
      },
    });
  }

  private convertToEntity(data: UserData): User {
    return User.load({
      id: new Id(data.id),
      name: new Name(data.name),
      email: new Email(data.email),
    });
  }
}
