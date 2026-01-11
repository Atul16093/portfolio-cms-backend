import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../../core/response-management';
import { ResponseUtil } from '../../core/response-management/response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseDto: ResponseDto;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // If it's already a ResponseDto, use it
        if ('success' in exceptionResponse && 'code' in exceptionResponse) {
          responseDto = exceptionResponse as ResponseDto;
        } else {
          // Otherwise, format it
          responseDto = {
            success: false,
            code: 'HTTP_EXCEPTION',
            message: (exceptionResponse as any).message || exception.message,
            errors: (exceptionResponse as any).errors,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }
      } else {
        responseDto = {
          success: false,
          code: 'HTTP_EXCEPTION',
          message: exceptionResponse as string || exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }
    } else {
      // Handle database errors
      const error = exception as any;
      if (error.code && error.code.startsWith('23')) {
        const dbError = ResponseUtil.mapDatabaseError(error);
        responseDto = {
          success: false,
          code: dbError.code,
          message: dbError.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
        status = HttpStatus.BAD_REQUEST;
      } else {
        responseDto = {
          success: false,
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }
    }

    response.status(status).json(responseDto);
  }
}

