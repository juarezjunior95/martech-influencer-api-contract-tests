import { Preset, PresetFilter, ProcessedPresetResult } from "../../domain/entities/preset.entity";
export interface IProcessPresetUseCase {
    execute(presetName: string, filters?: PresetFilter[]): Promise<ProcessedPresetResult>;
    createPresetEntity(presetName: string, filters?: PresetFilter[]): Promise<Preset>;
    processPresetEntity(preset: Preset): Promise<ProcessedPresetResult>;
}
