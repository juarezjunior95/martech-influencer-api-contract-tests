import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export interface TimeFrameBounds {
    ini: string;
    end: string;
}
export interface TimeFramePresetValue {
    values: TimeFrameBounds;
    default: TimeFrameBounds;
    enabled: boolean;
}
export interface TimeFramePresetConfig {
    volumeRefreshDate?: string;
}
declare class TimeFramePresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private buildFromVolumeRefreshDate;
}
export declare const timeFrameHandler: TimeFramePresetHandler;
export {};
