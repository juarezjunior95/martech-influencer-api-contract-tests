import { Injectable, Scope } from "@nestjs/common";
import { HeaderContext } from "@common/interfaces/header-context.interface";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
import { requestContextStorage } from "@common/utils/winston-context.format";

@Injectable({ scope: Scope.REQUEST })
export class HeaderContextService implements IHeaderContextService {
  private headerContext: HeaderContext | null = null;

  /**
   * @inheritDoc
   */
  setHeaderContext(context: HeaderContext): void {
    this.headerContext = context;
    // Store in AsyncLocalStorage for Winston logs
    requestContextStorage.enterWith(context);
  }

  /**
   * @inheritDoc
   */
  getHeaderContext(): HeaderContext | null {
    return this.headerContext;
  }

  /**
   * @inheritDoc
   */
  getRequestTraceId(): string | undefined {
    return this.headerContext?.requestTraceId;
  }

  /**
   * @inheritDoc
   */
  getCountry(): string | undefined {
    return this.headerContext?.country;
  }
}
