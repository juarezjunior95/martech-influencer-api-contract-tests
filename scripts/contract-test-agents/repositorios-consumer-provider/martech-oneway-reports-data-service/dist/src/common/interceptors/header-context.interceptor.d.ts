import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
export declare class HeaderContextInterceptor implements NestInterceptor {
    private readonly headerContextService;
    constructor(headerContextService: IHeaderContextService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
