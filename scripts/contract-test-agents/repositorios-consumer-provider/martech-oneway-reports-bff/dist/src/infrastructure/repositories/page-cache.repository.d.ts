import { IPageCacheRepository, PageCacheStoredEntry } from "../../domain/repositories/page-cache.repository.interface";
import { RedisClient } from "../services/redis.client";
export declare class PageCacheRepository implements IPageCacheRepository {
    private readonly redisClient;
    private readonly logger;
    private readonly CACHE_PREFIX;
    private readonly LOCK_PREFIX;
    constructor(redisClient: RedisClient);
    get(name: string, hash: string): Promise<string | null>;
    getStoredEntry(name: string, hash: string): Promise<PageCacheStoredEntry | null>;
    set(name: string, hash: string, data: string, expirationSeconds: number, tags: string[]): Promise<boolean>;
    invalidateByTags(tags: string[]): Promise<number>;
    acquireRevalidationLock(name: string, hash: string, ttlSeconds: number): Promise<boolean>;
    releaseRevalidationLock(name: string, hash: string): Promise<boolean>;
    private buildCacheKey;
    private buildLockKey;
}
