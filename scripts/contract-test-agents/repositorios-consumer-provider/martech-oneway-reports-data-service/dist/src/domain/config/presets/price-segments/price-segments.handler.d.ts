import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface PriceSegmentTuple {
    value: string;
    label: string;
}
export interface PriceSegmentsGroupBlock {
    group: string;
    values: PriceSegmentTuple[];
}
export interface PriceSegmentsPresetValue {
    enabled: boolean;
    default: Record<string, never>;
    values: PriceSegmentsGroupBlock[];
}
declare class PriceSegmentsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const priceSegmentsHandler: PriceSegmentsPresetHandler;
export {};
