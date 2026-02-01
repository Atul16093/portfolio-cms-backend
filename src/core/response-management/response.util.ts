import { ResponseDto } from './response.dto';
import { ResponseCode, ResponseMessage } from './response.enum';

export class ResponseUtil {
  static mapZodErrors(zodError: any): any[] {
    // Safety check: ensure errors array exists
    if (!zodError || !zodError.errors || !Array.isArray(zodError.errors)) {
      return [
        {
          field: 'unknown',
          message: 'Validation error occurred',
          code: 'VALIDATION_ERROR',
        },
      ];
    }

    return zodError.errors.map((error: any) => ({
      field: error.path && Array.isArray(error.path) ? error.path.join('.') : 'unknown',
      message: error.message || 'Validation failed',
      code: error.code || 'VALIDATION_ERROR',
    }));
  }

  static mapDatabaseError(error: any): { message: string; code: string } {
    if (error.code === '23505') {
      return {
        message: 'Duplicate entry violation',
        code: ResponseCode.CONFLICT,
      };
    }
    if (error.code === '23503') {
      return {
        message: 'Foreign key constraint violation',
        code: ResponseCode.VALIDATION_ERROR,
      };
    }
    return {
      message: ResponseMessage.DATABASE_ERROR,
      code: ResponseCode.DATABASE_ERROR,
    };
  }
}

