import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

/** Adiciona `compressed: false` exigido pelo consumer de portfolio performance. */
@Injectable()
export class PactCompressedResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((body: unknown) => {
        if (
          body &&
          typeof body === "object" &&
          "view" in body &&
          typeof (body as { view: unknown }).view === "string"
        ) {
          return { ...(body as object), compressed: false };
        }
        return body;
      }),
    );
  }
}
