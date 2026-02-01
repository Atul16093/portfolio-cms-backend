import { ResponseDto } from './response.dto';
import { ResponseCode, ResponseMessage } from './response.enum';

export class ResponseUtil {
  static mapZodErrors(zodError: any): any[] {
    // Check for issues or errors
    // ZodError has .issues (raw array) and .errors (getter for issues)
    const errorsToCheck = zodError.errors || zodError.issues;

    // Safety check: ensure errors array exists
    if (!errorsToCheck || !Array.isArray(errorsToCheck)) {
      // If it's a generic error with a message, use that
      if (zodError.message) {
        return [
          {
            field: 'global',
            message: zodError.message,
            code: 'VALIDATION_ERROR',
          },
        ];
      }

      return [
        {
          field: 'unknown',
          message: 'Validation error occurred',
          code: 'VALIDATION_ERROR',
        },
      ];
    }

    return errorsToCheck.map((error: any) => ({
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

