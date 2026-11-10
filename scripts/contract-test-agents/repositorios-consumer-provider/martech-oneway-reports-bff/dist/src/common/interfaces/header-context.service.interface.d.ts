import { HeaderContext } from "./header-context.interface";
export interface IHeaderContextService {
    setHeaderContext(context: HeaderContext): void;
    getHeaderContext(): HeaderContext | null;
    getPropagatedHeaders(baseHeaders: Record<string, string>): Record<string, string>;
    getRequestTraceId(): string | undefined;
    getCountry(): string | undefined;
}
