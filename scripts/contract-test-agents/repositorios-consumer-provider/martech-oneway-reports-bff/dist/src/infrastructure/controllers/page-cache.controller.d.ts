import { SetPageCacheDto } from "./dto/set-page-cache.dto";
import { GetPageCacheUseCase } from "../../application/usecases/get-page-cache.usecase";
import { SetPageCacheUseCase } from "../../application/usecases/set-page-cache.usecase";
export declare class PageCacheController {
    private readonly getPageCacheUseCase;
    private readonly setPageCacheUseCase;
    constructor(getPageCacheUseCase: GetPageCacheUseCase, setPageCacheUseCase: SetPageCacheUseCase);
    getPageCache(name: string, hash: string): Promise<import("@application/usecases/get-page-cache.usecase").GetPageCacheResult>;
    setPageCache(name: string, hash: string, dto: SetPageCacheDto): Promise<{
        cached: boolean;
    }>;
}
