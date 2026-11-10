import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { PresetConfig } from "@domain/entities/preset.entity";
import { FileLoaderService } from "@common/services/file-loader.service";
export declare class PresetConfigRepository implements IPresetConfigRepository {
    private readonly fileLoaderService;
    constructor(fileLoaderService: FileLoaderService);
    getByName(presetName: string): Promise<PresetConfig>;
    private getConfigPath;
}
