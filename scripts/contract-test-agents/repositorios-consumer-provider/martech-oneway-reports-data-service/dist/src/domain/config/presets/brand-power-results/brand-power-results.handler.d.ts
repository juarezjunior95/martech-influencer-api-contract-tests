import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { Dataset, DatasetConfig } from "@domain/entities/datasource.entity";
export interface BrandPowerResultsOption {
    value: string;
    label: string;
    full: string;
}
export interface BrandPowerResultsPresetValue {
    enabled: boolean;
    default: BrandPowerResultsOption | Record<string, never>;
    values: BrandPowerResultsOption[];
}
export type BrandPowerResultsPresetConfig = Record<string, never>;
declare class BrandPowerResultsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
}
export declare const brandPowerResultsHandler: BrandPowerResultsPresetHandler;
export {};
