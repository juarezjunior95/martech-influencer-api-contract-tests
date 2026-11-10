import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface BrandPowerBookScopeTuple {
    value: string;
    label: string;
    full: string;
}
export interface BrandPowerBookScopesPresetValue {
    enabled: boolean;
    default: BrandPowerBookScopeTuple | Record<string, never>;
    values: BrandPowerBookScopeTuple[];
}
export type BrandPowerBookScopesPresetConfig = Record<string, never>;
declare class BrandPowerBookScopesPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const brandPowerBookScopesHandler: BrandPowerBookScopesPresetHandler;
export {};
