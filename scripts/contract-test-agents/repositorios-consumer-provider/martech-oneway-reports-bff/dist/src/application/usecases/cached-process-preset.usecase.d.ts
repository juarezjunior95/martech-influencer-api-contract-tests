import { IProcessPresetUseCase } from "../interfaces/process-preset.usecase.interface";
import { IPresetCacheRepository } from "../../domain/repositories/preset-cache.repository.interface";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
import { Preset, PresetFilter, ProcessedPresetResult } from "../../domain/entities/preset.entity";
export declare class CachedProcessPresetUseCase implements IProcessPresetUseCase {
    private readonly processPresetUseCase;
    private readonly presetCacheRepository;
    private readonly userRepository;
    private readonly environmentConfig;
    private readonly logger;
    constructor(processPresetUseCase: IProcessPresetUseCase, presetCacheRepository: IPresetCacheRepository, userRepository: IUserRepository, environmentConfig: EnvironmentConfigService);
    execute(presetName: string, filters?: PresetFilter[]): Promise<ProcessedPresetResult>;
    createPresetEntity(presetName: string, filters?: PresetFilter[]): Promise<Preset>;
    processPresetEntity(preset: Preset): Promise<ProcessedPresetResult>;
}
