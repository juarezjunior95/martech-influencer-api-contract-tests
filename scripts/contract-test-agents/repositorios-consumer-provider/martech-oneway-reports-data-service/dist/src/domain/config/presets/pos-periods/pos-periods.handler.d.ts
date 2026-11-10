import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface PosPeriodTuple {
    value: string;
    label: string;
    full: string;
}
export interface PosPeriodPresetValue {
    enabled: boolean;
    default: PosPeriodTuple;
    values: PosPeriodTuple[];
}
export declare const POS_PERIODS: PosPeriodTuple[];
declare class PosPeriodsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const posPeriodsHandler: PosPeriodsPresetHandler;
export {};
