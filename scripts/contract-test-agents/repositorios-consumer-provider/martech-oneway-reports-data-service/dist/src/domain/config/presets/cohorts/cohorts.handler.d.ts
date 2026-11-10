import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { type DemographicTuple } from "./demographic-options.model";
export interface CohortGroupBlock {
    group: string;
    values: DemographicTuple[];
}
export interface CohortsPresetValue {
    enabled: boolean;
    default: DemographicTuple[];
    values: CohortGroupBlock[];
}
declare class CohortsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private tuplesForGroup;
}
export declare const cohortsHandler: CohortsPresetHandler;
export {};
