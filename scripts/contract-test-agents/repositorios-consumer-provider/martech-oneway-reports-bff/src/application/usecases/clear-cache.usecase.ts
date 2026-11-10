import { Inject, Injectable, Logger } from "@nestjs/common";
import { IViewCacheRepository } from "@domain/repositories/view-cache.repository.interface";
import { IPresetCacheRepository } from "@domain/repositories/preset-cache.repository.interface";

/**
 * Clear Cache Use Case
 * Handles cache invalidation by tags for multiple cache repositories
 */
@Injectable()
export class ClearCacheUseCase {
  private readonly logger = new Logger(ClearCacheUseCase.name);

  constructor(
    @Inject("IViewCacheRepository")
    private readonly viewCacheRepository: IViewCacheRepository,
    @Inject("IPresetCacheRepository")
    private readonly presetCacheRepository: IPresetCacheRepository,
  ) {}

  /**
   * Invalidates cache entries by tags
   * @param tags - Array of cache tags to invalidate
   * @returns Promise with the number of cache keys deleted
   */
  async execute(tags: string[]): Promise<{ deletedCount: number }> {
    const deletedCount = await this.viewCacheRepository.invalidateByTags(tags);
    const presetDeletedCount =
      await this.presetCacheRepository.invalidateByTags(tags);
    const totalDeletedCount = deletedCount + presetDeletedCount;

    this.logger.log(
      `Cache cleared for tags [${tags.join(", ")}]: ${totalDeletedCount} keys deleted`,
    );

    return { deletedCount: totalDeletedCount };
  }
}
