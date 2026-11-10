import {
  Preset,
  PresetFilter,
  ProcessedPresetResult,
} from "@domain/entities/preset.entity";

/**
 * Contract for the preset processing pipeline. Mirrors
 * IProcessViewUseCase so caching can be layered via the decorator
 * pattern.
 */
export interface IProcessPresetUseCase {
  execute(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<ProcessedPresetResult>;

  createPresetEntity(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<Preset>;

  processPresetEntity(preset: Preset): Promise<ProcessedPresetResult>;
}
