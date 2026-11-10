import { HeaderContext } from "../interfaces/header-context.interface";
import { IHeaderContextService } from "../interfaces/header-context.service.interface";
export declare class HeaderContextService implements IHeaderContextService {
    private headerContext;
    setHeaderContext(context: HeaderContext): void;
    getHeaderContext(): HeaderContext | null;
    getPropagatedHeaders(baseHeaders: Record<string, string>): Record<string, string>;
    getRequestTraceId(): string | undefined;
    getCountry(): string | undefined;
}
