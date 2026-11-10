import { Observable } from "rxjs";
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
export declare class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
