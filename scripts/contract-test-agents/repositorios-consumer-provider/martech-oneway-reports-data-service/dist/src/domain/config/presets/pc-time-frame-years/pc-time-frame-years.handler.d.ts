import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export interface PcTimeFrameYearsTuple {
    value: string;
    label: string;
    full: string;
}
export interface PcTimeFrameYearsPresetValue {
    values: PcTimeFrameYearsTuple[];
    default: PcTimeFrameYearsTuple | Record<string, never>;
    enabled: boolean;
}
export interface PcTimeFrameYearsPresetConfig {
    volumeRefreshDate?: string;
}
declare class PcTimeFrameYearsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private buildFromVolumeRefreshDate;
}
export declare const pcTimeFrameYearsHandler: PcTimeFrameYearsPresetHandler;
export {};
