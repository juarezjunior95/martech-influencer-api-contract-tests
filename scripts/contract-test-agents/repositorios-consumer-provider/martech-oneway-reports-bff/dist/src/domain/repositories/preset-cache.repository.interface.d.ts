import { Preset, ProcessedPresetResult } from "../entities/preset.entity";
import { UserEntity } from "../entities/user.entity";
export interface IPresetCacheRepository {
    getPreset(preset: Preset, user?: UserEntity | null): Promise<ProcessedPresetResult | null>;
    setPreset(preset: Preset, user: UserEntity | null, result: ProcessedPresetResult, ttl?: number): Promise<boolean>;
    invalidateByTags(tags: string[]): Promise<number>;
}
