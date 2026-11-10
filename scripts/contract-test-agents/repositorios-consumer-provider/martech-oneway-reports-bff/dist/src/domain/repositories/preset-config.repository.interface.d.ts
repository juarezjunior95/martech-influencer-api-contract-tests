import { PresetConfig } from "../entities/preset.entity";
export interface IPresetConfigRepository {
    getByName(presetName: string): Promise<PresetConfig | null>;
}
