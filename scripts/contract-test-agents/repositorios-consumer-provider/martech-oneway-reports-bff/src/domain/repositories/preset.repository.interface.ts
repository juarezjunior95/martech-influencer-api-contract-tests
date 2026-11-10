import { PresetData, PresetFilter } from "@domain/entities/preset.entity";

/**
 * Fetches preset data from the Data-Service.
 */
export interface IPresetRepository {
  getPreset(presetRef: string, filters?: PresetFilter[]): Promise<PresetData>;
}
