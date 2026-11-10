import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface GlobalBrandTuple {
    value: string;
    label: string;
    full: string;
}
export interface GlobalBrandsGroupBlock {
    group: string;
    values: GlobalBrandTuple[];
}
export interface GlobalBrandsPresetValue {
    enabled: boolean;
    default: GlobalBrandTuple | Record<string, never>;
    values: GlobalBrandsGroupBlock[];
}
export interface GlobalBrandsPresetConfig {
    noDefault?: boolean;
}
declare class GlobalBrandsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private buildGroups;
    private firstTuple;
    private toBool;
}
export declare const globalBrandsHandler: GlobalBrandsPresetHandler;
export {};
