import { PresetConfig } from "@domain/entities/preset.entity";

export interface IPresetConfigRepository {
  /**
   * Gets datasource configuration by name
   * @param presetName - Name of a preset (e.g., "value-creation/portfolio-performance/overview/category-growth-levers/occasions-development")
   * @returns Promise with PresetConfig
   */
  getByName(presetName: string): Promise<PresetConfig>;
}
