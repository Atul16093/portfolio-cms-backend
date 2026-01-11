import { SetMetadata } from '@nestjs/common';

export const RESPONSE_METADATA_KEY = 'response_metadata';

export interface ResponseMetadata {
  statusCode?: number;
  message?: string;
  code?: string;
}

export const ResponseMeta = (metadata: ResponseMetadata) =>
  SetMetadata(RESPONSE_METADATA_KEY, metadata);

