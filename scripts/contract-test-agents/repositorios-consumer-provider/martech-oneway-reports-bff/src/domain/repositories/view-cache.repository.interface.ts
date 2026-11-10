import { View } from "@domain/entities/view.entity";
import { UserEntity } from "@domain/entities/user.entity";

/**
 * View Cache Repository Interface
 * Manages cache operations specifically for view processing
 */
export interface IViewCacheRepository {
  /**
   * Retrieves cached view data by view entity and user context
   * @param viewEntity - View entity
   * @param user - Optional user entity for cache key generation
   * @returns Promise with cached view data if exists, null otherwise
   */
  getView(viewEntity: View, user?: UserEntity | null): Promise<any | null>;

  /**
   * Stores view data in cache with view entity, user context, and processed result
   * @param viewEntity - View entity
   * @param user - Optional user entity for cache key generation
   * @param result - Processed view result data to cache
   * @param ttl - Optional time to live in seconds
   * @returns Promise that resolves with true if cache was saved successfully, false otherwise
   */
  setView(
    viewEntity: View,
    user: UserEntity | null,
    result: any,
    ttl?: number,
  ): Promise<boolean>;

  /**
   * Invalidates cache entries by tags
   * @param tags - Array of cache tags to invalidate
   * @returns Promise with the number of cache keys deleted
   */
  invalidateByTags(tags: string[]): Promise<number>;
}
