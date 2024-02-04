import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ValueObject } from './ValueObject';

export const emailSchema = z.string().email();

export class Email extends ValueObject<string> {
  constructor(value: string) {
    if (!emailSchema.safeParse(value).success) {
      throw new BadRequestException('Invalid Email');
    }
    super(value);
  }
}
