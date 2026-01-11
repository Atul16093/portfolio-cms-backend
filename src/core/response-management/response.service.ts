import { Injectable } from '@nestjs/common';
import { ResponseDto, StandardResponse } from './response.dto';
import { ResponseCode, ResponseMessage } from './response.enum';
import { HttpStatusEnum } from './http-status.enum';

@Injectable()
export class ResponseService {
  success<T>(
    data?: T,
    message: string = ResponseMessage.SUCCESS,
    code: string = ResponseCode.SUCCESS,
    path?: string,
  ): ResponseDto<T> {
    return new StandardResponse(true, code, message, data, undefined, path);
  }

  created<T>(
    data?: T,
    message: string = ResponseMessage.CREATED,
    code: string = ResponseCode.CREATED,
    path?: string,
  ): ResponseDto<T> {
    return new StandardResponse(true, code, message, data, undefined, path);
  }

  updated<T>(
    data?: T,
    message: string = ResponseMessage.UPDATED,
    code: string = ResponseCode.UPDATED,
    path?: string,
  ): ResponseDto<T> {
    return new StandardResponse(true, code, message, data, undefined, path);
  }

  deleted(
    message: string = ResponseMessage.DELETED,
    code: string = ResponseCode.DELETED,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(true, code, message, undefined, undefined, path);
  }

  error(
    message: string = ResponseMessage.INTERNAL_ERROR,
    code: string = ResponseCode.INTERNAL_ERROR,
    errors?: any[],
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, errors, path);
  }

  notFound(
    message: string = ResponseMessage.NOT_FOUND,
    code: string = ResponseCode.NOT_FOUND,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, undefined, path);
  }

  validationError(
    errors: any[],
    message: string = ResponseMessage.VALIDATION_ERROR,
    code: string = ResponseCode.VALIDATION_ERROR,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, errors, path);
  }

  unauthorized(
    message: string = ResponseMessage.UNAUTHORIZED,
    code: string = ResponseCode.UNAUTHORIZED,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, undefined, path);
  }

  forbidden(
    message: string = ResponseMessage.FORBIDDEN,
    code: string = ResponseCode.FORBIDDEN,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, undefined, path);
  }

  conflict(
    message: string = ResponseMessage.CONFLICT,
    code: string = ResponseCode.CONFLICT,
    path?: string,
  ): ResponseDto {
    return new StandardResponse(false, code, message, undefined, undefined, path);
  }
}

