import { IPageCacheRepository } from "../../domain/repositories/page-cache.repository.interface";
import { IPageCacheConfigRepository } from "../../domain/repositories/page-cache-config.repository.interface";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
export interface GetPageCacheResult {
    html: string;
    isStale: boolean;
    cacheStatus: "fresh" | "stale";
    shouldRevalidate: boolean;
    ttlRemainingSeconds: number | null;
    freshWindowSeconds: number;
    staleWindowSeconds: number;
}
export declare class GetPageCacheUseCase {
    private readonly pageCacheRepository;
    private readonly pageCacheConfigRepository;
    private readonly environmentConfig;
    private readonly logger;
    private readonly REVALIDATION_LOCK_SECONDS;
    constructor(pageCacheRepository: IPageCacheRepository, pageCacheConfigRepository: IPageCacheConfigRepository, environmentConfig: EnvironmentConfigService);
    execute(name: string, hash: string): Promise<GetPageCacheResult | null>;
}
