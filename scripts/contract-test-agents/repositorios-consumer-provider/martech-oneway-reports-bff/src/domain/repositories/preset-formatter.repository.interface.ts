import { PresetData } from "@domain/entities/preset.entity";

/**
 * Applies a JSONata transform to a preset response.
 * Input `data` is the flat preset JSON returned by the Data-Service.
 */
export interface IPresetFormatterRepository {
  format(formatter: string, data: PresetData): Promise<PresetData>;
}
