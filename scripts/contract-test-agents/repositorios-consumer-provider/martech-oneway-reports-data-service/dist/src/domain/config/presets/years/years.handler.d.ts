import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
export interface YearTuple {
    value: string;
    label: string;
    full: string;
}
export interface YearPresetValue {
    enabled: boolean;
    default: YearTuple | Record<string, never>;
    values: YearTuple[];
}
export interface YearsPresetConfig {
    noDefault?: boolean;
    startYear?: number;
    endYear?: number;
}
declare class YearsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private resolveRange;
    private buildYears;
}
export declare const yearsHandler: YearsPresetHandler;
export {};
