import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';
import { ResponseUtil } from '../../core/response-management';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = ResponseUtil.mapZodErrors(error);
        throw new BadRequestException({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors,
          timestamp: new Date().toISOString(),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

