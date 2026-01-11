import { BadRequestException } from '@nestjs/common';
import { ResponseDto } from '../../core/response-management';

export class ValidationException extends BadRequestException {
  constructor(errors: any[]) {
    const response: ResponseDto = {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    };
    super(response);
  }
}

