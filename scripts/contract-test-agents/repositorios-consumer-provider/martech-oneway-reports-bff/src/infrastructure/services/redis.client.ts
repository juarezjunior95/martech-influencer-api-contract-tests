import { Injectable, Inject, Logger } from "@nestjs/common";
import { Redis } from "ioredis";

/**
 * Redis Client
 * Redis cache operations
 */
@Injectable()
export class RedisClient {
  private readonly logger = new Logger(RedisClient.name);
  private readonly DEFAULT_TTL = 2592000; // 30 days in seconds

  constructor(@Inject("REDIS_CLIENT") private readonly client: Redis) {}

  /**
   * Checks if Redis is offline
   */
  isOffline(): boolean {
    const status = this.client.status;
    return status !== "ready" && status !== "connect";
  }

  /**
   * Sets a key-value pair in Redis
   * @param key - Redis key
   * @param value - Value to store
   * @param ttl - Optional time to live in seconds (default: 2592000s / 30 days)
   * @param tags - Optional array of tags to associate with the cache key
   * @returns Success status
   */
  async set(
    key: string,
    value: string,
    ttl: number = this.DEFAULT_TTL,
    tags: string[] = [],
  ): Promise<string> {
    try {
      const result = await this.client.set(key, value, "EX", ttl);
      if (tags.length > 0) {
        await this.linkTagsToCache(tags, key);
      }
      return result;
    } catch (error) {
      this.logger.error(`Failed to set key "${key}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Links cache key to tags using Redis sets
   * @param tags - Array of tag names
   * @param cacheKey - Cache key to link to tags
   */
  private async linkTagsToCache(
    tags: string[],
    cacheKey: string,
  ): Promise<void> {
    try {
      for (const tag of tags) {
        await this.client.sadd(tag, cacheKey);
      }
    } catch (error) {
      this.logger.error(
        `Failed to link tags to cache key "${cacheKey}": ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Gets a value from Redis by key
   * @param key - Redis key
   * @returns Value if exists, null otherwise
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Failed to get key "${key}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a key from Redis
   * @param key - Redis key to delete
   * @returns Number of keys deleted (0 if key didn't exist, 1 if deleted)
   */
  async delete(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key "${key}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Invalidates cache by tags - deletes all cache keys associated with the given tags
   * @param tags - Array of tag names to invalidate
   * @returns Number of cache keys deleted
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    let totalDeleted = 0;
    try {
      for (const tag of tags) {
        const cacheKeys = await this.client.smembers(tag);
        if (cacheKeys.length === 0) {
          continue;
        }
        // Delete each cache key associated with the tag
        for (const key of cacheKeys) {
          await this.client.del(key);
          totalDeleted++;
        }
        // Delete the tag set itself
        await this.client.del(tag);
      }
      return totalDeleted;
    } catch (error) {
      this.logger.error(
        `Failed to invalidate by tags [${tags.join(", ")}]: ${error.message}`,
      );
      throw error;
    }
  }
}
