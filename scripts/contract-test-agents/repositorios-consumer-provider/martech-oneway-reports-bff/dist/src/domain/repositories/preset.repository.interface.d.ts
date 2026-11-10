import { PresetData, PresetFilter } from "../entities/preset.entity";
export interface IPresetRepository {
    getPreset(presetRef: string, filters?: PresetFilter[]): Promise<PresetData>;
}
