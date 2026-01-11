import { NotFoundException } from '@nestjs/common';
import { ResponseDto } from '../../core/response-management';

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, identifier?: string) {
    const response: ResponseDto = {
      success: false,
      code: 'NOT_FOUND',
      message: `${resource}${identifier ? ` with ${identifier}` : ''} not found`,
      timestamp: new Date().toISOString(),
    };
    super(response);
  }
}

