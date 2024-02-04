import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { ValueObject } from './ValueObject';

export const idSchema = z.string().uuid();
export class Id extends ValueObject<string> {
  constructor(value: string = randomUUID()) {
    if (!idSchema.safeParse(value).success) {
      throw new BadRequestException('Invalid Id');
    }
    super(value);
  }
}
