import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export interface PcTimeFrameTuple {
    value: string;
    label: string;
    full: string;
}
export interface PcTimeFramePresetValue {
    values: PcTimeFrameTuple[];
    default: PcTimeFrameTuple | Record<string, never>;
    enabled: boolean;
}
export interface PcTimeFramePresetConfig {
    volumeRefreshDate?: string;
}
declare class PcTimeFramePresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private resolveVolumeRefreshDate;
    private buildFromVolumeRefreshDate;
}
export declare const pcTimeFrameHandler: PcTimeFramePresetHandler;
export {};
