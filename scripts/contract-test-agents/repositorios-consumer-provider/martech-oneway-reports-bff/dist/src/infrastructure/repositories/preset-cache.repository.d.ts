import { IPresetCacheRepository } from "../../domain/repositories/preset-cache.repository.interface";
import { Preset, ProcessedPresetResult } from "../../domain/entities/preset.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { RedisClient } from "../services/redis.client";
export declare class PresetCacheRepository implements IPresetCacheRepository {
    private readonly redisClient;
    private readonly logger;
    private readonly CACHE_PREFIX;
    private readonly DEFAULT_TTL;
    private readonly USER_COUNTRY_SCOPE;
    constructor(redisClient: RedisClient);
    getPreset(preset: Preset, user?: UserEntity | null): Promise<ProcessedPresetResult | null>;
    setPreset(preset: Preset, user: UserEntity | null, result: ProcessedPresetResult, ttl?: number): Promise<boolean>;
    private buildCacheKey;
    private buildUserScopeKey;
    private buildCacheTags;
    invalidateByTags(tags: string[]): Promise<number>;
    private hash;
}
