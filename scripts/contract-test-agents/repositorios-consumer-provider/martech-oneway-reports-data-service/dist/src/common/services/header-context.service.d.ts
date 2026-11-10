import { HeaderContext } from "@common/interfaces/header-context.interface";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
export declare class HeaderContextService implements IHeaderContextService {
    private headerContext;
    setHeaderContext(context: HeaderContext): void;
    getHeaderContext(): HeaderContext | null;
    getRequestTraceId(): string | undefined;
    getCountry(): string | undefined;
}
