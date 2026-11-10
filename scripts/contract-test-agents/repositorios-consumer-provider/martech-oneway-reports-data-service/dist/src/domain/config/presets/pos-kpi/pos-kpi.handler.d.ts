import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
export interface PosKpiTuple {
    value: string;
    label: string;
}
export interface PosKpiPresetValue {
    enabled: boolean;
    default: PosKpiTuple;
    values: PosKpiTuple[];
}
declare class PosKpiPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const posKpiHandler: PosKpiPresetHandler;
export {};
