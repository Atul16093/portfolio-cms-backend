import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from './response.dto';
import { ResponseService } from './response.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private responseService: ResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // If data is already a ResponseDto, return it as is
        if (data && typeof data === 'object' && 'success' in data && 'code' in data) {
          return { ...data, path };
        }

        // Otherwise, wrap it in a success response
        const status = context.switchToHttp().getResponse().statusCode;
        
        if (status === HttpStatus.CREATED) {
          return this.responseService.created(data, undefined, undefined, path);
        }
        
        return this.responseService.success(data, undefined, undefined, path);
      }),
    );
  }
}

