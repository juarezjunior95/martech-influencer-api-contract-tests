import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface SegmentTuple {
    value: string;
    label: string;
    full: string;
}
export interface SegmentPresetValue {
    enabled: boolean;
    default: SegmentTuple | Record<string, never>;
    values: SegmentTuple[];
}
export interface SegmentsPresetConfig {
    scope?: string;
    noDefault?: boolean;
    includeAll?: boolean;
}
declare class SegmentsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private buildValues;
    private resolveScope;
    private toBool;
}
export declare const segmentsHandler: SegmentsPresetHandler;
export {};
