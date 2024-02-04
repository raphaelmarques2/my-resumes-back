import { BadRequestException } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

export function validateDto(dto: any, schema: ZodSchema) {
  try {
    schema.parse(dto);
  } catch (error) {
    throw new BadRequestException();
  }
}

export function validateId(id: string) {
  try {
    z.string().uuid().parse(id);
  } catch (error) {
    throw new BadRequestException('Invalid id');
  }
}
