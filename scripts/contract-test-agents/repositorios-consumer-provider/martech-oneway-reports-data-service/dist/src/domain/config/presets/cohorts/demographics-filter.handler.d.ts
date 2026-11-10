import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { type DemographicTuple } from "./demographic-options.model";
export interface DemographicFilterPresetValue {
    enabled: boolean;
    default: DemographicTuple | Record<string, never>;
    values: DemographicTuple[];
}
type DemographicResponseKey = "genders" | "age-groups" | "income-groups";
declare class DemographicsFilterPresetHandler implements IPresetHandler<PresetResponse> {
    private readonly responseKey;
    private readonly getTuples;
    constructor(responseKey: DemographicResponseKey, getTuples: () => DemographicTuple[]);
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const genderFilterHandler: DemographicsFilterPresetHandler;
export declare const ageGroupsFilterHandler: DemographicsFilterPresetHandler;
export declare const incomeGroupsFilterHandler: DemographicsFilterPresetHandler;
export {};
