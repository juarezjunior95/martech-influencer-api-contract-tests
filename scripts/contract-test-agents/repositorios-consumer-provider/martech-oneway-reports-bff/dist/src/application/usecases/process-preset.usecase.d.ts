import { IProcessPresetUseCase } from "../interfaces/process-preset.usecase.interface";
import { IPresetConfigRepository } from "../../domain/repositories/preset-config.repository.interface";
import { IPresetRepository } from "../../domain/repositories/preset.repository.interface";
import { IPresetFormatterRepository } from "../../domain/repositories/preset-formatter.repository.interface";
import { Preset, PresetFilter, ProcessedPresetResult } from "../../domain/entities/preset.entity";
export declare class ProcessPresetUseCase implements IProcessPresetUseCase {
    private readonly presetConfigRepository;
    private readonly presetRepository;
    private readonly formatterRepository;
    private readonly logger;
    constructor(presetConfigRepository: IPresetConfigRepository, presetRepository: IPresetRepository, formatterRepository: IPresetFormatterRepository);
    execute(presetName: string, filters?: PresetFilter[]): Promise<ProcessedPresetResult>;
    createPresetEntity(presetName: string, filters?: PresetFilter[]): Promise<Preset>;
    processPresetEntity(preset: Preset): Promise<ProcessedPresetResult>;
    private applyPerRefFormatters;
}
