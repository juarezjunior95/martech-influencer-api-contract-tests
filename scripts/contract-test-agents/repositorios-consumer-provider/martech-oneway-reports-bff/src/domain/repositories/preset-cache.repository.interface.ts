import { Preset, ProcessedPresetResult } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";

/**
 * Cache repository for preset responses. Unlike ViewCacheRepository the
 * key always includes the current user so different users never receive
 * a cached preset that was filtered for somebody else.
 */
export interface IPresetCacheRepository {
  getPreset(
    preset: Preset,
    user?: UserEntity | null,
  ): Promise<ProcessedPresetResult | null>;
  setPreset(
    preset: Preset,
    user: UserEntity | null,
    result: ProcessedPresetResult,
    ttl?: number,
  ): Promise<boolean>;
  invalidateByTags(tags: string[]): Promise<number>;
}
