import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface DistributionTuple {
    value: string;
    label: string;
    full: string;
}
export interface DistributionPresetValue {
    enabled: boolean;
    default: DistributionTuple | Record<string, never>;
    values: DistributionTuple[];
}
export type DistributionsPresetConfig = Record<string, never>;
declare class DistributionsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const distributionsHandler: DistributionsPresetHandler;
export {};
