export enum ResponseCode {
  SUCCESS = 'SUCCESS',
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONFLICT = 'CONFLICT',
}

export enum ResponseMessage {
  SUCCESS = 'Operation completed successfully',
  CREATED = 'Resource created successfully',
  UPDATED = 'Resource updated successfully',
  DELETED = 'Resource deleted successfully',
  NOT_FOUND = 'Resource not found',
  VALIDATION_ERROR = 'Validation failed',
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Access forbidden',
  INTERNAL_ERROR = 'Internal server error',
  DATABASE_ERROR = 'Database operation failed',
  CONFLICT = 'Resource conflict',
}

