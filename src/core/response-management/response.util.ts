import { ResponseDto } from './response.dto';
import { ResponseCode, ResponseMessage } from './response.enum';

export class ResponseUtil {
  static mapZodErrors(zodError: any): any[] {
    return zodError.errors.map((error: any) => ({
      field: error.path.join('.'),
      message: error.message,
      code: error.code,
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

