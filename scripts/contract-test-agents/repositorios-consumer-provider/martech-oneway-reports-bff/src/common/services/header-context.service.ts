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
  getPropagatedHeaders(
    baseHeaders: Record<string, string>,
  ): Record<string, string> {
    if (!this.headerContext) {
      return baseHeaders;
    }

    const propagatedHeaders: Record<string, string> = {};

    if (this.headerContext.authorization) {
      propagatedHeaders["Authorization"] = this.headerContext.authorization;
    }
    if (this.headerContext.requestTraceId) {
      propagatedHeaders["requestTraceId"] = this.headerContext.requestTraceId;
    }
    if (this.headerContext.country) {
      propagatedHeaders["country"] = this.headerContext.country;
    }
    if (this.headerContext.accept) {
      propagatedHeaders["Accept"] = this.headerContext.accept;
    }
    if (this.headerContext.acceptLanguage) {
      propagatedHeaders["Accept-Language"] = this.headerContext.acceptLanguage;
    }
    if (this.headerContext.contentType) {
      propagatedHeaders["Content-Type"] = this.headerContext.contentType;
    }

    return {
      ...baseHeaders,
      ...propagatedHeaders,
    };
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
