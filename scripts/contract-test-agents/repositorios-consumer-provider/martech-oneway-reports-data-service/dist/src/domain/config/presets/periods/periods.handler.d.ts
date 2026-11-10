import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface PeriodTuple {
    value: string;
    label: string;
    full: string;
}
export interface PeriodPresetValue {
    enabled: boolean;
    default: PeriodTuple | Record<string, never>;
    values: PeriodTuple[];
}
export interface PeriodsPresetConfig {
    scope?: string;
    noDefault?: boolean;
}
declare class PeriodsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private buildValues;
    private resolveScope;
}
export declare const periodsHandler: PeriodsPresetHandler;
export {};
