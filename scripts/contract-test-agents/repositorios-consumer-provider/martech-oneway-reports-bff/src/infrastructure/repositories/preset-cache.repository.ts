import { Inject, Injectable, Logger } from "@nestjs/common";
import { createHash } from "crypto";
import { IPresetCacheRepository } from "@domain/repositories/preset-cache.repository.interface";
import { Preset, ProcessedPresetResult } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { RedisClient } from "@infrastructure/services/redis.client";

/**
 * Redis cache for preset responses. Keys are scoped by preset name,
 * filters, and — unlike the view cache — the authenticated user. The
 * user scoping is mandatory here because the Data-Service response
 * already reflects that user's country permissions.
 */
@Injectable()
export class PresetCacheRepository implements IPresetCacheRepository {
  private readonly logger = new Logger(PresetCacheRepository.name);
  private readonly CACHE_PREFIX = "preset:";
  private readonly DEFAULT_TTL = 2592000; // 30 days in seconds
  private readonly USER_COUNTRY_SCOPE = "OneWayReports.CountryViewer.Read";

  constructor(
    @Inject("RedisClient")
    private readonly redisClient: RedisClient,
  ) {}

  async getPreset(
    preset: Preset,
    user?: UserEntity | null,
  ): Promise<ProcessedPresetResult | null> {
    if (this.redisClient.isOffline()) {
      this.logger.warn("Redis is offline, skipping preset cache read");
      return null;
    }

    try {
      const cacheKey = this.buildCacheKey(preset, user);
      const cached = await this.redisClient.get(cacheKey);
      if (!cached) {
        return null;
      }
      const parsed = JSON.parse(cached) as Partial<ProcessedPresetResult>;
      if (
        !parsed ||
        typeof parsed.name !== "string" ||
        typeof parsed.data !== "object" ||
        parsed.data === null
      ) {
        this.logger.warn(
          `Discarding malformed preset cache for "${preset.getName()}"`,
        );
        return null;
      }
      return parsed as ProcessedPresetResult;
    } catch (error) {
      this.logger.error(
        `Error reading preset cache for "${preset.getName()}": ${error.message}`,
      );
      return null;
    }
  }

  async setPreset(
    preset: Preset,
    user: UserEntity | null,
    result: ProcessedPresetResult,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<boolean> {
    if (this.redisClient.isOffline()) {
      this.logger.warn("Redis is offline, skipping preset cache write");
      return false;
    }

    try {
      const cacheKey = this.buildCacheKey(preset, user);
      const tags = this.buildCacheTags(preset);
      await this.redisClient.set(cacheKey, JSON.stringify(result), ttl, tags);
      return true;
    } catch (error) {
      this.logger.error(
        `Error writing preset cache for "${preset.getName()}": ${error.message}`,
      );
      return false;
    }
  }

  private buildCacheKey(preset: Preset, user?: UserEntity | null): string {
    const parts: string[] = [`${this.CACHE_PREFIX}${preset.getName()}`];

    const filters = preset.getSortedFilters();
    if (filters.length) {
      parts.push(`filters:${this.hash(JSON.stringify(filters))}`);
    }

    const userScope = this.buildUserScopeKey(user);
    if (userScope) {
      parts.push(`user:${userScope}`);
    }

    return parts.join(":");
  }

  private buildUserScopeKey(user?: UserEntity | null): string | null {
    if (!user) return null;
    const scopes = user.getScopes(true);
    const country = user.country ?? "";

    if (!scopes.length && !country) return null;

    // Use a plain sorted array — JSON.stringify omits Set contents (serializes as {}),
    // which would make different supportedCountries collapse to the same hash.
    let countryKey: string | string[] = country;
    if (scopes.includes(this.USER_COUNTRY_SCOPE)) {
      const supportedCountries = user.supportedCountries ?? [];
      countryKey = [...new Set([country, ...supportedCountries])].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
    }

    return this.hash(JSON.stringify({ countryKey, scopes }));
  }

  private buildCacheTags(preset: Preset): string[] {
    const tags = preset.getCacheConfig().tags ?? [];
    return tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
  }

  /**
   * Invalidates preset cache entries by tags.
   * @param tags - Array of tag names (without prefix)
   * @returns Number of keys deleted
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    try {
      if (!tags || tags.length === 0) {
        this.logger.warn("No tags provided for preset cache invalidation");
        return 0;
      }

      const prefixedTags = tags.map((tag) => `${this.CACHE_PREFIX}${tag}`);
      const deletedCount =
        await this.redisClient.invalidateByTags(prefixedTags);
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error invalidating preset cache for tags [${tags.join(", ")}]: ${error.message}`,
      );
      throw error;
    }
  }

  private hash(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }
}
