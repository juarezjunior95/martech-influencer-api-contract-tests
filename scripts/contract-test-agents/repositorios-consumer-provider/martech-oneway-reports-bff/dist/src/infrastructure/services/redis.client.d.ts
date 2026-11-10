import { Redis } from "ioredis";
export declare class RedisClient {
    private readonly client;
    private readonly logger;
    private readonly DEFAULT_TTL;
    constructor(client: Redis);
    isOffline(): boolean;
    set(key: string, value: string, ttl?: number, tags?: string[]): Promise<string>;
    private linkTagsToCache;
    get(key: string): Promise<string | null>;
    ttl(key: string): Promise<number | null>;
    acquireLock(key: string, ttlSeconds: number): Promise<boolean>;
    releaseLock(key: string): Promise<boolean>;
    delete(key: string): Promise<number>;
    invalidateByTags(tags: string[]): Promise<number>;
}
