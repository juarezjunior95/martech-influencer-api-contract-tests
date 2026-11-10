import { Injectable, Inject, Logger } from "@nestjs/common";
import { IViewCacheRepository } from "@domain/repositories/view-cache.repository.interface";
import { View } from "@domain/entities/view.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { RedisClient } from "@infrastructure/services/redis.client";
import { createHash } from "crypto";

@Injectable()
export class ViewCacheRepository implements IViewCacheRepository {
  private readonly logger = new Logger(ViewCacheRepository.name);
  private readonly CACHE_PREFIX = "view:";
  private readonly DEFAULT_TTL = 2592000; // 30 days in seconds

  constructor(
    @Inject("RedisClient")
    private readonly redisClient: RedisClient,
  ) {}

  /**
   * @inheritDoc
   */
  async getView(
    viewEntity: View,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user?: UserEntity | null,
  ): Promise<any | null> {
    if (this.redisClient.isOffline()) {
      this.logger.warn("Redis is offline, returning null");
      return null;
    }

    try {
      // @TODO Check if we need to control cache by user scope.
      // Remove the user scope from cache handling temporarily since we are not
      // yet validating user permissions in the backend.
      // const cacheKey = this.buildCacheKey(viewEntity, user);
      const cacheKey = this.buildCacheKey(viewEntity);
      const cachedData = await this.redisClient.get(cacheKey);

      if (!cachedData) {
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      this.logger.error(
        `Error retrieving cache for view "${viewEntity.getView()}": ${error.message}`,
      );
      return null;
    }
  }

  /**
   * @inheritDoc
   */
  async setView(
    viewEntity: View,
    user: UserEntity | null,
    result: any,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<boolean> {
    if (this.redisClient.isOffline()) {
      this.logger.warn("Redis is offline, skipping set operation");
      return false;
    }

    try {
      // @TODO Check if we need to control cache by user scope.
      // Remove the user scope from cache handling temporarily since we are not
      // yet validating user permissions in the backend.
      // const cacheKey = this.buildCacheKey(viewEntity, user);
      const cacheKey = this.buildCacheKey(viewEntity);
      const serializedData = JSON.stringify(result);
      const cacheTags = this.buildCacheTags(viewEntity);

      await this.redisClient.set(cacheKey, serializedData, ttl, cacheTags);
      return true;
    } catch (error) {
      this.logger.error(
        `Error storing cache for view "${viewEntity.getView()}": ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Builds a unique cache key for a view based on view name, filter sets and user scopes.
   *
   * @param viewEntity - The view entity containing view name and filter sets
   * @param user - Optional user entity to include scopes in the key
   * @returns A cache key string that uniquely identifies the cached view
   */
  private buildCacheKey(viewEntity: View, user?: UserEntity | null): string {
    const view = viewEntity.getView();
    const baseKey = `${this.CACHE_PREFIX}${view}`;
    const keyParts: string[] = [];

    const filterSets = viewEntity.getFilterSets(true);
    if (filterSets.length) {
      keyParts.push(`filters:${this.createHash(JSON.stringify(filterSets))}`);
    }

    if (user) {
      const userScopes = user.getScopes(true);
      if (userScopes.length) {
        keyParts.push(
          `user-scopes:${this.createHash(JSON.stringify(userScopes))}`,
        );
      }
    }

    return keyParts.length ? `${baseKey}:${keyParts.join(":")}` : baseKey;
  }

  /**
   * Builds an array of cache tags for the view.
   * Returns tags from the view's cache configuration with the "view:" prefix applied.
   *
   * @param viewEntity - The view entity containing view name and cache configuration
   * @returns An array of cache tag strings for invalidation purposes
   */
  private buildCacheTags(viewEntity: View): string[] {
    const cacheConfig = viewEntity.getCacheConfig();

    if (!cacheConfig.tags?.length) {
      return [];
    }

    return cacheConfig.tags.map((tag) => this.addPrefixToTag(tag));
  }

  /**
   * @inheritDoc
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    try {
      if (!tags || tags.length === 0) {
        this.logger.warn("No tags provided for cache invalidation");
        return 0;
      }

      const prefixedTags = tags.map((tag) => this.addPrefixToTag(tag));
      const deletedCount =
        await this.redisClient.invalidateByTags(prefixedTags);

      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error invalidating cache for tags [${tags.join(", ")}]: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Adds the cache prefix to a tag.
   *
   * @param tag - Tag name without prefix
   * @returns Tag with "view:" prefix
   */
  private addPrefixToTag(tag: string): string {
    return `${this.CACHE_PREFIX}${tag}`;
  }

  /**
   * Creates a SHA-256 hash of the input data.
   * Used only for cache key generation (non-cryptographic use case — fingerprinting).
   * Returns the full 256-bit hash as a 64-character hexadecimal string.
   *
   * @param data - String data to hash
   * @returns A hexadecimal SHA-256 hash string (64 characters)
   */
  private createHash(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }
}
