export interface ResponseDto<T = any> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
  path?: string;
}

export class StandardResponse<T = any> implements ResponseDto<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
  path?: string;

  constructor(
    success: boolean,
    code: string,
    message: string,
    data?: T,
    errors?: any[],
    path?: string,
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}

