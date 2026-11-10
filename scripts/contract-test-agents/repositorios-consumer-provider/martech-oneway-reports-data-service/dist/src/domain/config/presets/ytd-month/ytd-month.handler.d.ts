import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface YtdMonthTuple {
    value: string;
    label: string;
    full: string;
}
export interface YtdMonthPresetValue {
    enabled: boolean;
    default: YtdMonthTuple | Record<string, never>;
    values: YtdMonthTuple[];
}
export type YtdMonthPresetConfig = Record<string, never>;
declare class YtdMonthPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const ytdMonthHandler: YtdMonthPresetHandler;
export {};
