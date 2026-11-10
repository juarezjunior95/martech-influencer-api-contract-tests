import { PresetConfig } from "@domain/entities/preset.entity";
export interface IPresetConfigRepository {
    getByName(presetName: string): Promise<PresetConfig>;
}
