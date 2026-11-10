import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * Loads BFF-side preset configuration files from disk.
 */
export interface IPresetConfigRepository {
  getByName(presetName: string): Promise<PresetConfig | null>;
}
