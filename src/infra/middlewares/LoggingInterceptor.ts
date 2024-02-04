import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.originalUrl;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`${response.statusCode} | [${method}] ${url} - ${delay}ms`);
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        const statusCode = error.statusCode ?? response.statusCode;

        console.error(`${statusCode} | [${method}] ${url} - ${delay}ms`);
        return throwError(() => error);
      }),
    );
  }
}
