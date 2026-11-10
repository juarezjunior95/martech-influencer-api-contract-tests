import { PageCacheConfig } from "../entities/page-cache.entity";
export interface IPageCacheConfigRepository {
    getByName(name: string): Promise<PageCacheConfig | null>;
}
