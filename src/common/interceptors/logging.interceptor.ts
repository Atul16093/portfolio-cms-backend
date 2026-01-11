import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, originalUrl, ip, headers } = request;
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} from ${ip}`,
      'HTTP',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          this.logger.logRequest(request, response, responseTime);
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `Request Failed: ${method} ${originalUrl} - ${error.message}`,
            error.stack,
            'HTTP',
          );
          this.logger.logRequest(request, response, responseTime);
        },
      }),
    );
  }
}

