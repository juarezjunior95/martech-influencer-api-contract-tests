import { IPageCacheRepository } from "../../domain/repositories/page-cache.repository.interface";
import { IPageCacheConfigRepository } from "../../domain/repositories/page-cache-config.repository.interface";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
export declare class SetPageCacheUseCase {
    private readonly pageCacheRepository;
    private readonly pageCacheConfigRepository;
    private readonly environmentConfig;
    private readonly logger;
    constructor(pageCacheRepository: IPageCacheRepository, pageCacheConfigRepository: IPageCacheConfigRepository, environmentConfig: EnvironmentConfigService);
    execute(name: string, hash: string, html: string): Promise<boolean>;
}
