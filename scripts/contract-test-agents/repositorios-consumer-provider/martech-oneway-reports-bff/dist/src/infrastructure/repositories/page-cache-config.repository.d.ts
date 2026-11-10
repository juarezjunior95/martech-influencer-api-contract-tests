import { IPageCacheConfigRepository } from "../../domain/repositories/page-cache-config.repository.interface";
import { PageCacheConfig } from "../../domain/entities/page-cache.entity";
export declare class PageCacheConfigRepository implements IPageCacheConfigRepository {
    private readonly logger;
    private readonly require;
    private readonly configPath;
    getByName(name: string): Promise<PageCacheConfig | null>;
}
