import { PresetData } from "../entities/preset.entity";
export interface IPresetFormatterRepository {
    format(formatter: string, data: PresetData): Promise<PresetData>;
}
