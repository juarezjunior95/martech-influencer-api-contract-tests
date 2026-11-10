import { Observable, throwError } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { catchError, timeout } from "rxjs/operators";
import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from "@nestjs/common";

const configService = new ConfigService();

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const limit = Number(configService.get<number>("TIMEOUT") || "20000");
    return next.handle().pipe(
      timeout(limit),
      catchError((err) => {
        if (err.name === "TimeoutError")
          return throwError(
            () =>
              new RequestTimeoutException(
                `Operation timed out after ${limit}ms`,
              ),
          );
        return throwError(() => err);
      }),
    );
  }
}
