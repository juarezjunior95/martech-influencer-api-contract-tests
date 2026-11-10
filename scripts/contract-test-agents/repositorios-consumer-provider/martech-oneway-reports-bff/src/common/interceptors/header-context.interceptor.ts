import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";

@Injectable()
export class HeaderContextInterceptor implements NestInterceptor {
  constructor(
    @Inject("IHeaderContextService")
    private readonly headerContextService: IHeaderContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    const requestTraceId = headers?.requesttraceid || headers?.requestTraceId;
    const country = headers?.country;

    const headerContext = {
      authorization: headers?.authorization,
      requestTraceId,
      country,
      accept: headers?.accept,
      acceptLanguage: headers?.["accept-language"] || "en",
      contentType: headers?.["content-type"],
    };

    this.headerContextService.setHeaderContext(headerContext);

    return next.handle();
  }
}
