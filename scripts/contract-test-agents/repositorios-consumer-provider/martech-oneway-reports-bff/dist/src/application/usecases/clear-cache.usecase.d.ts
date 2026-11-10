import { IViewCacheRepository } from "../../domain/repositories/view-cache.repository.interface";
import { IPresetCacheRepository } from "../../domain/repositories/preset-cache.repository.interface";
import { IPageCacheRepository } from "../../domain/repositories/page-cache.repository.interface";
export declare class ClearCacheUseCase {
    private readonly viewCacheRepository;
    private readonly presetCacheRepository;
    private readonly pageCacheRepository;
    private readonly logger;
    constructor(viewCacheRepository: IViewCacheRepository, presetCacheRepository: IPresetCacheRepository, pageCacheRepository: IPageCacheRepository);
    execute(tags: string[]): Promise<{
        deletedCount: number;
    }>;
}
