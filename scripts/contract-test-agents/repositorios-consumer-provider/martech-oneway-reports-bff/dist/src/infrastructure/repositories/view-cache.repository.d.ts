import { IViewCacheRepository } from "../../domain/repositories/view-cache.repository.interface";
import { View } from "../../domain/entities/view.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { RedisClient } from "../services/redis.client";
export declare class ViewCacheRepository implements IViewCacheRepository {
    private readonly redisClient;
    private readonly logger;
    private readonly CACHE_PREFIX;
    private readonly DEFAULT_TTL;
    constructor(redisClient: RedisClient);
    getView(viewEntity: View, user?: UserEntity | null): Promise<any | null>;
    setView(viewEntity: View, user: UserEntity | null, result: any, ttl?: number): Promise<boolean>;
    private buildCacheKey;
    private buildCacheTags;
    invalidateByTags(tags: string[]): Promise<number>;
    private addPrefixToTag;
    private createHash;
}
