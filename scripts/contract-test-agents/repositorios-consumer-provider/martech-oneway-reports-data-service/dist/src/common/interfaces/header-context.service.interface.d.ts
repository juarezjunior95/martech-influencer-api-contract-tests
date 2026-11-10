import { HeaderContext } from "./header-context.interface";
export interface IHeaderContextService {
    setHeaderContext(context: HeaderContext): void;
    getHeaderContext(): HeaderContext | null;
    getRequestTraceId(): string | undefined;
    getCountry(): string | undefined;
}
