import { IPresetConfigRepository } from "../../domain/repositories/preset-config.repository.interface";
import { PresetConfig } from "../../domain/entities/preset.entity";
export declare class PresetConfigRepository implements IPresetConfigRepository {
    private readonly logger;
    private readonly require;
    private readonly presetsPath;
    getByName(presetName: string): Promise<PresetConfig | null>;
    private resolveConfigPath;
    private formatPresetName;
}
