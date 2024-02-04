import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ValueObject } from './ValueObject';

export const nameSchema = z.string().min(1);
export class Name extends ValueObject<string> {
  constructor(value: string) {
    if (!nameSchema.safeParse(value).success) {
      throw new BadRequestException('Invalid Name');
    }
    super(value);
  }
}
