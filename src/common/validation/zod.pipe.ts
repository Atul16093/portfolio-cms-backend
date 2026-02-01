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
        // Ensure we have a valid ZodError with errors array
        const errors = ResponseUtil.mapZodErrors(error);
        throw new BadRequestException({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors,
          timestamp: new Date().toISOString(),
        });
      }
      // Handle case where error might not be a ZodError instance
      // but could still be a Zod validation error
      if (error && typeof error === 'object' && 'errors' in error) {
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

